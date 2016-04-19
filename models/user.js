// Load required packages
var mongoose = require('mongoose');

// Define our User schema
var UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, index:{unique: true}},
  mobilePhone: { type: String, required: true },
  card:[{
  	cardNumber:{type: Number, required: true},
  	cardName:{type:String,required:true},
  	cardExpireDate:{type: String, required:true}
  }],
  address:[{
  	addressInfo:{type:String, required:true},
  	state:{type:String, required:true},
  	zipcode:{type: Number,required:true}
  }],

  dateCreated: { type: Date, default: Date.now },
  productsSelling: { type: [String], default: []},
  productsWatching: { type: [String], default: []},
  productsBought: { type: [String], default: []}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
