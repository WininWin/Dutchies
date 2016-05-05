// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Product = require('./models/product');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var configDB = require('./auth/database.js');
var router = express.Router();
var lib = require("./lib.js")
var fs = require('fs');
var multer = require('multer');

//connect to the database on mlab
mongoose.connect(configDB.url);

//passport configuration for accounts
require('./auth/passport')(passport);

// Create our Express application
var app = express();

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'b3289dc35a565e1334112c56378ef66a4b08913ab265a6b0ec0c374decf02cb33def22e1dd1ce3f595e2c08ac226dda7990139ea1df634c16f07e1616153b749' }));
app.use(passport.initialize());
app.use(passport.session());


// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb'
}));
app.use(bodyParser.json({
	extended: true,
	limit: '50mb'
}));

// enable uploads for photos
var uploading = multer({
  dest: __dirname + '/../client/public/uploads/',
  limits: {fileSize: 3000000, files:1},
})


//serve our client side
app.use('/',express.static(__dirname + '/../client/public'));
//serve our API and authentication side
require('./auth/routes.js')(app, passport, User, Product, fs, uploading);

app.post('/uploads/test',function(req,res){
	// console.log(req.files.picture);
	res.status(200);
	res.json({'message':'success'});
})

// Launch the script to update prices
var priceUpdateRate = 5000
console.log('Launching price update daemon');
setInterval(lib.priceDaemon, priceUpdateRate);


// Start the server
app.listen(port);
console.log('Server running on port ' + port);
