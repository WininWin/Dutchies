// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our User schema
var UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index:{unique: true}},
  password: { type: String },
  mobilePhone: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  productsSelling: { type: [String], default: []},
  productsWatching: { type: [String], default: []},
  productsBought: { type: [String], default: []}
});


UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
