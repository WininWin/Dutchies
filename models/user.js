// Load required packages
var mongoose = require('mongoose');

// Define our User schema
var UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, index:{unique: true}},
  mobilePhone: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  productsSelling: { type: [String], default: []},
  productsWatching: { type: [String], default: []},
  productsBought: { type: [String], default: []}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
