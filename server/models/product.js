// Load required packages
var mongoose = require('mongoose');

// Define our Products schema
var ProductSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  description: {type: String, default: ''},
  category:{type:String, required:true},
  reservePrice:  { type: Number, required: true },
  startPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  cyclesSinceLastPriceUpdate: { type: Number, default: 0 },
  soldPrice: { type: Number },
  sold: { type: Boolean, default: false},
  dateCreated: {type: Date, default: Date.now },
  dateSold:{type:Date},
  usersWatching: { type: [String], default: []},
  numUsersWatching: { type: String, default: 0 },
  sellerUser: { type: String, default: '' },
  sellerUserName: { type: String, default: ''},
  sellerUserEmail: { type: String, default: ''},
  soldToUser: { type: String, default: '' },
  soldToUserName: { type: String, default: ''},
  soldToUserEmail: { type: String, default: ''},
  img:{type: String},
  shippingPrice:{type:Number, default: 0}
});

// Export the Mongoose model
module.exports = mongoose.model('Product', ProductSchema);
