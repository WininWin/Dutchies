module.exports = function(app, passport, User, Product) {


	/******************* Auth Routes *******************/

	app.post('/auth/signup', passport.authenticate('local-signup'), function(req, res) {
		res.status(201);
		res.json({"message":"OK", "data": req.user});
	});

	app.post('/auth/login', passport.authenticate('local-login'), function(req, res) {
		res.json({
			user: req.user
		});
	});

	/* get all the user data pertaining to the logged in user */
	app.get('/auth/user', isLoggedIn, function(req, res) {
		res.json({ message: "OK",
			data: req.user
		});
	});

	/* get all the products that the logged in user has sold or is selling */
	app.get('/auth/products/selling', isLoggedIn, function(req, res) {
		Product.find({"sellerUser":req.user._id})
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
	});
	
	/* get all the products that the logged in user has bought */
	app.get('/auth/products/buying', isLoggedIn, function(req, res) {
		Product.find({"soldToUser":req.user._id})
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
	});

	/* get all the products that the logged in user is watching */
	app.get('/auth/products/watching', isLoggedIn, function(req, res) {
		Product.find({"usersWatching":req.user._id})
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
	});

	// when a user buys a product, marks it as sold, updates buying user PATCH??


	// allow a user to create a new product for sale POST


	// allow a user to delete their product DELETE


	// change details about item PUT


	// allow user to edit their account details PUT


	// user wants to watch an item

	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.sendStatus(200);
	});




	/****** Special Dev Routes ******/
	app.get('/dev/emptydb', function(req, res) {
		User.remove({},function(error) {
			if(error) {
				res.status(500);
				res.json({"message":errorToString(error),"data":[]});
			}
			else {
				Product.remove({},function(error) {
				if(error) {
					res.status(500);
					res.json({"message":errorToString(error),"data":[]});
				}
				else {
					res.status(200);
					res.json({"message":"Database is now empty","data":[]})
				}
			});
			}
		});
	});


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

	//function for checking if we're logged in
	function isLoggedIn(req, res, next) {
		console.log(req.isAuthenticated());
		if(req.isAuthenticated())
			return next();

		res.sendStatus(401).json({message:"User not logged in",
			data: []
		});
	}






	/******************* API Routes *******************/
	/* These routes need to be removed or better authenticated only to super users at a later time. */

	/***** default Route *****/
		var homeRoute = app.route('/api');

		homeRoute.get(function(req, res) {
		  res.json({"message":"Nothing here. Go to /users or /products to access the API.","data":[]});
		});


	/***** users Route *****/
		var userRoute = app.route('/api/users');

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
		var useridRoute = app.route('/api/users/:id');

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
		var productRoute = app.route('/api/products');

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
		var productidRoute = app.route('/api/products/:id');

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


};