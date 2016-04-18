// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Product = require('./models/product');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://dbuser:dc37cc626997d140f8174b1c141b240fbaa1dd55fb315f0e60d549ddcd84c163@ds059682.mlab.com:59682/cs498rk-fp');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
	extended: true
}));

// All our routes will start with /api
app.use('/api', router);


/******************* Helper functions *******************/

//function that takes an error and turns it into a string for returning to the user
function errorToString(error) {
	errorString = error.name + ": ";
	for(var i in error.errors)
	{
		errorString += error.errors[i].message;
		errorString += " ";
	}
	return errorString;
}

//function for casting our params for searching the db
function getParam(param) {
  return eval("("+param+")");
}

/******************* Routes *******************/

/***** default Route *****/
	var homeRoute = router.route('/');

	homeRoute.get(function(req, res) {
	  res.json({"message":"Nothing here. Go to /users or /products to access the API.","data":[]});
	});

/***** users Route *****/
	var userRoute = router.route('/users');

	/* GET */
	userRoute.get(function(req, res) {
		//check for count param
		if(req.query.count) {
			User.count(getParam(req.query.where))
			.exec(function(error,result){
				if(error) {
					res.status(500);
					res.json({"message":errorToString(error),"data":[]});
				}
				else {
					res.status(200);
					res.json({"message":"OK","data":result})
				}
			})
		}
		else {
			User.find(getParam(req.query.where))
			.sort(getParam(req.query.sort))
			.select(getParam(req.query.select))
			.skip(req.query.skip)
			.limit(req.query.limit)
			.exec(function(error,result){
				if(error) {
					res.status(500);
					res.json({"message":errorToString(error),"data":[]});
				}
				else {
					res.status(200);
					res.json({"message":"OK","data":result})
				}
			})
		}
	});

	/* POST */
	userRoute.post(function(req, res) {
		User.create(req.body, function(error,result){
			if(error) {
				res.status(500);
				//handle a duplicate email error (since it's a special case)
				if(error.name == "MongoError" && error.code == 11000)
					res.json({"message":"This email already exists","data":[]});
				else
					res.json({"message":errorToString(error),"data":[]});
			}
			else {
				res.status(201);
				res.json({"message":"User added","data":result})
			}
		});
	});

/***** users/:id Route *****/
	var useridRoute = router.route('/users/:id');

	/* GET */
	useridRoute.get(function(req, res) {
		//get the user by id
		User.findById(req.params.id,function(error,result){
			if(error || result==null) {
				res.status(404);
				res.json({"message":"User not found","data":[]});
			}
			else {

				res.status(200);
				res.json({"message":"OK","data":result})
			}
		})
	});

	/* PUT */
	useridRoute.put(function(req, res) {
		//get the user by id to update it
		User.findById(req.params.id,function(error,result){
			if(error || result==null) {
				res.status(404);
				res.json({"message":"User not found","data":[]});
			}
			else {
				//now we have the user, we'll update it and then save it
				User.findByIdAndUpdate(req.params.id,req.body,function(error) {
					if(error) {
						res.status(500);
						res.json({"message":errorToString(error),"data":[]});
					}
					else {
						User.findById(req.params.id,function(error,result_inner){
							if(error || result==null) {
								res.status(404);
								res.json({"message":"An unknown error occured","data":[]});
							}
							else {
								res.status(200);
								res.json({"message":"User updated","data":result_inner})
							}
						});
					}
				})
			}
		})
	});

	/* DELETE */
	useridRoute.delete(function(req, res) {
		//get the user by id to update it
		User.findById(req.params.id,function(error,result){
			if(error || result==null) {
				res.status(404);
				res.json({"message":"User not found","data":[]});
			}
			else {
				//now we have the user, we'll delete it
				result.remove(function(error) {
					if(error) {
						res.status(500);
						res.json({"message":errorToString(error),"data":[]});
					}
					else {
						res.status(200);
						res.json({"message":"User deleted","data":[]})
					}
				})
			}
		})
	});

/***** products Route *****/
	var productRoute = router.route('/products');

	/* GET */
	productRoute.get(function(req, res) {
		//check for count param
		if(req.query.count) {
			Product.count(getParam(req.query.where))
			.exec(function(error,result){
				if(error) {
					res.status(500);
					res.json({"message":errorToString(error),"data":[]});
				}
				else {
					res.status(200);
					res.json({"message":"OK","data":result})
				}
			})
		}
		else {
			Product.find(getParam(req.query.where))
			.sort(getParam(req.query.sort))
			.select(getParam(req.query.select))
			.skip(req.query.skip)
			.limit(req.query.limit)
			.exec(function(error,result){
				if(error) {
					res.status(500);
					res.json({"message":errorToString(error),"data":[]});
				}
				else {
					res.status(200);
					res.json({"message":"OK","data":result})
				}
			})
		}
	});

	/* POST */
	productRoute.post(function(req, res) {
		Product.create(req.body, function(error,result){
			if(error) {
				res.status(500);
				res.json({"message":errorToString(error),"data":[]});
			}
			else {
				res.status(201);
				res.json({"message":"Product added","data":result})
			}
		});
	});

/***** products/:id Route *****/
	var productidRoute = router.route('/products/:id');

	/* GET */
	productidRoute.get(function(req, res) {
		//get the user by id
		Product.findById(req.params.id,function(error,result){
			if(error || result==null) {
				res.status(404);
				res.json({"message":"Product not found","data":[]});
			}
			else {

				res.status(200);
				res.json({"message":"OK","data":result})
			}
		})
	});

	/* PUT */
	productidRoute.put(function(req, res) {
		//get the product by id to update it
		Product.findById(req.params.id,function(error,result){
			if(error || result==null) {
				res.status(404);
				res.json({"message":"Product not found","data":[]});
			}
			else {
				//now we have the product, we'll update it and then save it
				Product.findByIdAndUpdate(req.params.id,req.body,function(error) {
					if(error) {
						res.status(500);
						res.json({"message":errorToString(error),"data":[]});
					}
					else {
						Product.findById(req.params.id,function(error,result_inner){
							if(error || result==null) {
								res.status(404);
								res.json({"message":"An unknown error occured","data":[]});
							}
							else {
								res.status(200);
								res.json({"message":"Product updated","data":result_inner})
							}
						});
					}
				})
			}
		})
	});

	/* DELETE */
	productidRoute.delete(function(req, res) {
		//get the product by id to update it
		Product.findById(req.params.id,function(error,result){
			if(error || result==null) {
				res.status(404);
				res.json({"message":"Product not found","data":[]});
			}
			else {
				//now we have the product, we'll delete it
				result.remove(function(error) {
					if(error) {
						res.status(500);
						res.json({"message":errorToString(error),"data":[]});
					}
					else {
						res.status(200);
						res.json({"message":"Product deleted","data":[]})
					}
				})
			}
		})
	});


// Start the server
app.listen(port);
console.log('Server running on port ' + port);
