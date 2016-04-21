module.exports = function(app, passport) {

	app.post('/auth/signup', passport.authenticate('local-signup'), function(req, res) {
		res.redirect('/');
	});

	app.post('/auth/login', passport.authenticate('local-login'), function(req, res) {
		res.redirect('/');
	});

	app.get('/auth/profile', isLoggedIn, function(req, res) {
		res.json({
			user: req.user
		});
	});

	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();

		res.json({
			error: "User not logged in"
		});
	}

};