/********* A library of helper functions **********/

var User = require('./models/user');
var Product = require('./models/product');


this.priceDaemon = function() {
	// increment cycles cine last updated for all products
	var conditions = { sold: false, $where: "this.currentPrice >= this.reservePrice" }
	  , update = { $inc: { cyclesSinceLastPriceUpdate: 1 }}
	  , options = { multi: true };
	Product.update(conditions,update,options,function(){});

	// get all the products that haven't been updated in the last n cycles (let n be 5 for now)
	Product.find({$where: "this.cyclesSinceLastPriceUpdate > 5" })
		.exec(function(error,result){
			if(error) {
				// nothing
			}
			else {
				var updatedCount = 0;
				for (var i = 0; i < result.length; i++) {
					// update based on the formula: 
					// let r be a random number between 0 and 1
					// let w be the number of users watching the products
					// if Math.pow(1.05,w)>r:
					// 	decrease the price by r/10% of the difference between the start price and the reserve price
					var r = Math.random();
					var w = result[i].usersWatching.length;
					if(Math.pow(1.05,(-1)*w)>(r*3/4)){
						updatedCount += 1;
						var newPrice = (parseInt(result[i].currentPrice)) + (((result[i].startPrice-result[i].reservePrice)*r*.0001).toFixed(2))*-1.0;
						if (newPrice >= result[i].reservePrice) 
							Product.findByIdAndUpdate(result[i]._id,{ currentPrice: newPrice, cyclesSinceLastPriceUpdate:0},function(error){});
						else 
							Product.findByIdAndUpdate(result[i]._id,{ currentPrice: result[i].startPrice, cyclesSinceLastPriceUpdate:0},function(error){});
					}
				}
			}
		});

}