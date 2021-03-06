module.exports = function(app, passport, User, Product, fs, uploading) {


	/******************* Specialized API Routes *******************/

	app.post('/auth/signup', passport.authenticate('local-signup'), function(req, res) {
		res.status(201);
		res.json({"message":"OK", "data": req.user});
	});

	app.post('/auth/password', passport.authenticate('local-password-change'), function(req, res) {
		res.status(200);
		res.json({"message":"Password changed", "data": req.user});
	});

	app.post('/auth/login', passport.authenticate('local-login'), function(req, res) {
		res.json({ "message": "OK", "data": req.user
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
		if(req.query.count) {
			Product.count({"sellerUser":req.user._id})
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
		}
	});
	
	/* get all the products that the logged in user has bought */
	app.get('/auth/products/buying', isLoggedIn, function(req, res) {
		if(req.query.count) {
			Product.count({"soldToUser":req.user._id})
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
		}
	});

	/* get all the products that the logged in user is watching */
	app.get('/auth/products/watching', isLoggedIn, function(req, res) {
		if(req.query.count) {
			Product.count({"usersWatching":req.user._id,sold:false})
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
			Product.find({"usersWatching":req.user._id,sold:false})
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

	// add a new product to sell
	/* POST */
	app.post('/auth/products',uploading.single('img'),isLoggedIn, function(req, res) {
		if (req.file)
			req.body.img = '/uploads/' + req.file.filename;
		else
			req.body.img = '/data/images/nopreview.jpg';
		if(!req.body.currentPrice)
			req.body.startPrice = req.body.currentPrice;
		req.body.sellerUser = req.user._id;
		req.body.sellerUserName = req.user.name;
		req.body.sellerUserEmail = req.user.email;
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

	// update a product 
	/* PUT */
	app.put('/auth/products/:id',uploading.single('img'),isLoggedIn, function(req, res) {
		if (req.file)
			req.body.img = '/uploads/' + req.file.filename;
		else if (req.img="keep_current")
			delete req.body.img;
		else
			req.body.img = '/data/images/nopreview.jpg';
		req.body.sellerUser = req.user._id;
		req.body.sellerUserName = req.user.name;
		req.body.sellerUserEmail = req.user.email;
		Product.findByIdAndUpdate(req.params.id,req.body, function(error,result){
			if(error) {
				res.status(500);
				res.json({"message":errorToString(error),"data":[]});
			}
			else {
				res.status(201);
				res.json({"message":"Product updated","data":result})
			}
		});
	});


	// when a user buys a product, marks it as sold, updates buying user PATCH??
	app.put('/auth/products/buy/:id',isLoggedIn,function(req,res){

		Product.findById(req.params.id, function(error,result){
			if(result){
				result.sold = true;
				result.dateSold = Date.now();
				result.soldPrice = result.currentPrice;
				result.soldToUser = req.user._id;
				result.soldToUserName = req.user.name;
				result.soldToUserEmail = req.user.email;
				result.save(function(error){
					res.status(200);
					res.json({"message":"OK","data":result})
				})
			}
			else{
				res.status(500);
				res.json({"message":"ERROR", "data":[]});
			}
		});

	})




	// delete a product
	app.delete('/auth/products/:id', isLoggedIn, function(req,res){
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
	})


	// allow user to edit their account details PUT
	app.put('/auth/user/update', isLoggedIn, function(req, res) {
		console.log(req.user);
		console.log(req.body);
		User.findByIdAndUpdate(req.user._id,req.body,function(error) {
			if(error) {
				res.status(500);
				res.json({"message":errorToString(error),"data":[]});
			}
			else {
				User.findById(req.user._id,function(error,result_inner){
					if(error) {
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
	});

	// user wants to watch an item
	app.put('/auth/products/watch/:id',isLoggedIn,function(req,res){

		Product.findById(req.params.id, function(error,result){
			if(result){
				result.usersWatching.push(req.user._id);
				result.numUsersWatching +=1;
				result.save(function(error){
					res.status(200);
					res.json({"message":"OK","data":result})
				})
			}

			else{
				res.status(500);
				res.json({"message":"ERROR", "data":[]});
			}
		});

	})


	app.put('/auth/products/unwatch/:id',isLoggedIn,function(req,res){
		console.log("start unwatch");

		Product.findById(req.params.id, function(error,result){
			if (result.usersWatching!= null){
				var index = result.usersWatching.indexOf(req.user._id);
				result.usersWatching.splice(index,1);
				result.numUsersWatching -= 1;
			}
			else{
				console.log("this cannot be happen!!!!!!!!!!NO WAY!!");
			}	
			result.save(function(error){
				res.status(200);
				res.json({"message":"OK","data":result});
			})

		})
	})

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

	/* POST */
	app.post('/dev/products',function(req, res) {
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
		if(req.isAuthenticated())
			return next();

		res.sendStatus(401).json({message:"User not logged in",
			data: []
		});
	}






	/******************* General API Routes *******************/

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
		productRoute.post(uploading.single('img'),function(req, res) {
			console.log(req.file);
			if (req.file)
				req.body.img = '/uploads/' + req.file.filename;
			else
				req.body.img = '/data/images/nopreview.jpg';
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
		productidRoute.put(uploading.single('img'),function(req, res) {
			if (req.file){
				req.body.img = '/uploads/' + req.file.filename;
				console.log("image was uploaded");
			}
			else{
				req.body.img = '/data/images/nopreview.jpg';
				console.log("NO image was uploaded");
			}
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