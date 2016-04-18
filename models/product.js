// Load required packages
var mongoose = require('mongoose');

// Define our Products schema
var ProductSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  description: {type: String, default: ''},
  reservePrice:  { type: Number, required: true },
  sold: { type: Boolean, default: false},
  sellerUser: { type: String, default: '' },
  sellerUserName: { type: String, default: ''},
  dateCreated: {type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('Product', ProductSchema);
