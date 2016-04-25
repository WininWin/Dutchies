// Load required packages
var mongoose = require('mongoose');

// Define our Products schema
var ProductSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  description: {type: String, default: ''},
  category:{type:String, required:true},
  reservePrice:  { type: Number, required: true },
  sold: { type: Boolean, default: false},
  dateCreated: {type: Date, default: Date.now },
  dateSold:{type:Date},
  currentPrice: { type: Number, required: true },
  usersWatching: { type: [String], default: []},
  sellerUser: { type: String, default: '' },
  sellerUserName: { type: String, default: ''},
  sellerUserEmail: { type: String, default: ''},
  soldToUser: { type: String, default: '' },
  soldToUserName: { type: String, default: ''},
  soldToUserEmail: { type: String, default: ''},
  img: {data:Buffer, contentType: String}
  shipping:{ type: Number, required:true}
});

// Export the Mongoose model
module.exports = mongoose.model('Product', ProductSchema);
 