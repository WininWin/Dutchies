module.exports = function(app, passport) {

	app.post('/auth/signup', passport.authenticate('local-signup'), function(req, res) {
		res.sendStatus(201);
	});

	app.post('/auth/login', passport.authenticate('local-login'), function(req, res) {
		res.sendStatus(200);
	});

	app.get('/auth/profile', isLoggedIn, function(req, res) {
		res.json({
			user: req.user
		});
	});

	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.sendStatus(200);
	});

	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();

		res.json({
			error: "User not logged in"
		});
	}

};