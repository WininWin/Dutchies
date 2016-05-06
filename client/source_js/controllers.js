var webAppControllers = angular.module('webAppControllers', ['ngMaterial', 'ngMessages', 'ngFileUpload']);


webAppControllers.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

//global functions
webAppControllers.run(function($rootScope,$http,$state,$window, CurrentUser) {
	$window.sessionStorage.loggedin = 0;
	$rootScope.account = "";
	$rootScope.loggingout = 0;
    $rootScope.logout = function() {
    	$rootScope.loggingout = 1;
        CurrentUser.userLogout().success(function(data){
        	$state.go('app');
        	$window.sessionStorage.userdata = "";
        	$window.sessionStorage.loggedin = 0;
        	$rootScope.loggedin = 0;
        	$rootScope.account = "Login";
        	$rootScope.loggingout = 0;
        })
        .error(function(error){
        	$rootScope.loggingout = 0;
        });
    };

    $rootScope.watch = function(productid) {
    	
    };


});



webAppControllers.controller('HeaderController',['$scope', '$state', '$rootScope', function($scope,$state, $rootScope) {
  	$rootScope.query = ''
	//After login, login button should changed to My Account
	$scope.searchOnEnter = function (keyEvent) {
		if (keyEvent.keyIdentifier == "Enter") {
			$scope.search($scope.query);
		}
	}

  	$scope.search = function(query){
  		$rootScope.query = query;
		$scope.prevDisabled = true;
		$scope.search_progress = true; 
		$scope.result = false;
		if(typeof query != 'undefined' && query != ""){
			$state.go('app.search', {query: $rootScope.query })

		}
		else{
			$("#warning").text("Put at least 1 word");
			$scope.search_progress = false; 
		}
		
	};


}]);

webAppControllers.controller('ContentController',['$scope' ,'$state','$http', '$rootScope', 'CommonData', 'CurrentUser', function($scope, $state, $http,$rootScope, CommonData, CurrentUser) {

		$scope.progress = [];
		for(i = 0; i < 3; i++){
			$scope.progress[i] = true;
		}
		
		//Get all products data for home contents 
		CommonData.mostWatchedProducts().success(function(data) {
			if(data.message=="OK") {
				$scope.mostWatchedProducts = data.data;
				$scope.progress[1] = false;
			}
		});

		CommonData.mostRecentProducts().success(function(data) {
	
				$scope.mostRecentProducts = data.data;
				$scope.progress[0] = false;
			
		});

		CommonData.countProducts().success(function(data) {
			if(data.message=="OK") {
				CommonData.randomProducts(6,data.data).success(function(data){
					$scope.randomProducts = data.data;
					$scope.progress[2] = false;
				});
			}
		});


}]);

webAppControllers.controller('SearchController',['$scope' ,'$state','$http', '$rootScope', 'CommonData', 'CurrentUser', '$stateParams', function($scope, $state, $http,$rootScope, CommonData, CurrentUser, $stateParams) {
		
		$scope.categories = ["All","Baby Products (Excluding Apparel)","Beauty","Books","Camera & Photo","Cell Phones","Clothing & Accessories","Collectible Coins","Collectibles (Books)","Collectibles (Entertainment)","Electronics (Accessories)","Electronics (Consumer)","Fine Art","Grocery & Gourmet Food","Handmade","Health & Personal Care","Historical & Advertising Collectibles","Home & Garden","Industrial & Scientific","Jewelry","Luggage & Travel Accessories","Music","Musical Instruments","Office Products","Outdoors","Personal Computers","Shoes, Handbags & Sunglasses","Software & Computer Games","Sports","Sports Collectibles","Tools & Home Improvement","Toys & Games","Video, DVD & Blu-Ray","Video Games & Video Game Consoles","Watches","Wine"]

		$scope.page = 0;
		$scope.sortselector = 'dateCreated';
		$scope.sortorder = 1;
		$scope.filtercategory = "All";


		$scope.PrevList = function(){
			$scope.search_progress = true; 
			$scope.result = false;
		    $scope.page = $scope.page-1;
		    if ($scope.page == 0) 
		    	$scope.prevDisabled = true;
		  
		    CommonData.searchProducts($rootScope.query, $scope.page, $scope.sortselector,$scope.sortorder,$scope.filtercategory).success(function(data){
			      $scope.search_progress = false; 
				  $rootScope.search_products = data.data;
				  $scope.result = true;
				  $scope.nextDisabled = false;
				  $rootScope.search_products.pop();
		    });
		};

		$scope.NextList = function(){
			$scope.prevDisabled = false;
		    $scope.page=$scope.page+1;
		  	$scope.search_progress = true; 
			$scope.result = false;
		    CommonData.searchProducts($rootScope.query, $scope.page, $scope.sortselector,$scope.sortorder,$scope.filtercategory).success(function(data){
		 

				$scope.search_progress = false; 
				$rootScope.search_products = data.data;
				$scope.result = true;

				if ($scope.search_products.length <= 10)
					$scope.nextDisabled = true;
				else {
					$scope.nextDisabled = false;
					$rootScope.search_products.pop();
				}
		    });

		};


		$scope.progress = [];
		for(i = 0; i < 3; i++){
			$scope.progress[i] = true;
		}



		$scope.performSearch = function(query){
			$scope.prevDisabled = true;
			$scope.search_progress = true; 
			$scope.result = false;
			if(typeof query != 'undefined' && query != ""){
				// $state.go("app.search");
				$scope.page = 0;
				//$scope.result = query;
				CommonData.searchProducts($rootScope.query,$scope.page,$scope.sortselector,$scope.sortorder,$scope.filtercategory).success(function(data){	
					$scope.search_progress = false; 
					$rootScope.search_products = data.data;
					$scope.result = true;
					if ($scope.search_products.length <= 10){
						$scope.noresults = 0;
						$scope.nextDisabled = true;
					}
					else {
						$scope.noresults = 0;
						$scope.nextDisabled = false;
						$rootScope.search_products.pop();
					}
					if(!$scope.search_products.length)
						$scope.noresults = 1;

				});


			}
			else{
				$("#warning").text("Put at least 1 word");
				$scope.search_progress = false; 
			}
			
		};

		$scope.search = function(query){
			$scope.prevDisabled = true;
			$scope.search_progress = true; 
			$scope.result = false;
			if(typeof query != 'undefined' && query != ""){
				$state.go('app.search', {query: $rootScope.query })

			}
			else{
				$("#warning").text("Put at least 1 word");
				$scope.search_progress = false; 
			}
			
		};

		$rootScope.query = $stateParams.query;
		$scope.performSearch($rootScope.query);

		$scope.refresh = function(){
			$scope.page = 0;
			$scope.search_progress = true; 
			$scope.result = false;
			$scope.prevDisabled = true;
			CommonData.searchProducts($rootScope.query,$scope.page,$scope.sortselector,$scope.sortorder,$scope.filtercategory).success(function(data){
					$scope.search_progress = false; 
					$rootScope.search_products = data.data;
					$scope.result = true;
					if ($scope.search_products.length <= 10)
						$scope.nextDisabled = true;
					else {
						$scope.nextDisabled = false;
						$rootScope.search_products.pop();
					}

			});


		}


}]);

webAppControllers.controller('FooterController',['$scope', '$state','$window', function($scope,$state,$window) {
 	


}]);


webAppControllers.controller('LoginController',['$scope', '$state', '$http', '$rootScope', 'CurrentUser', '$window', function($scope,$state,$http,$rootScope, CurrentUser, $window) {
	$scope.submitting = 0;
 	$scope.login = function() {
 		$scope.submitting = 1;
 		$scope.loginError = 0;
		var login_creds = {"email":$scope.email,"password":$scope.password};
	 	CurrentUser.userLogin(login_creds).success(function(data) {
	 		$scope.submitting = 0;
			if(!data.error) {
				$window.sessionStorage.userdata = JSON.stringify(data.data);
				$window.sessionStorage.loggedin = 1;
				$state.go("app.account");
			}

	   })
	 	.error(function(){
	 		$scope.submitting = 0;
	 		$scope.loginError = 1;
	 	});
	 }

	 // check if we are logged in, if not redirect to login
	// if($rootScope.loggedin)
	// 	$state.go("app.account");

	CurrentUser.getSampleUser().success(function(data) {
		if(data.message=="OK") {
			$scope.sample_user = data.data[0].email;
			$scope.email = data.data[0].email;
		}
    });
 

}]);

webAppControllers.controller('BuyController', ['$scope', '$state' , '$http', '$rootScope', 'CurrentUser', function($scope, $state,$http, $rootScope, CurrentUser) {
   	$scope.purchase_list = false;
   	$scope.list_progress = true;

   	$scope.page = 0;

   	$scope.PrevList = function(){


	    $scope.nextDisabled = false;



	    $scope.page = $scope.page-1;
	    if ($scope.page == 0)
	    	$scope.prevDisabled = true;
	  	$scope.purchase_list = false;
   		$scope.list_progress = true;
	    CurrentUser.getUserBuying($scope.page).success(function(data){
	    	$scope.products = data.data;
	    	$scope.purchase_list = true;
   			$scope.list_progress = false;
   			$scope.products.pop();
	    });
	};

	$scope.NextList = function(){
	    $scope.page=$scope.page+1;
	  	$scope.purchase_list = false;
   		$scope.list_progress = true;
   		$scope.prevDisabled = false;
	    CurrentUser.getUserBuying($scope.page).success(function(data){
	 		$scope.purchase_list = true;
   			$scope.list_progress = false;

		    $scope.products = data.data;
		    if ($scope.products.length <= 10)
				$scope.nextDisabled = true;
			else {
				$scope.nextDisabled = false;
				$scope.products.pop();
			}
	    });

	};

	$scope.status = function(item){
		if(item.shipped==undefined || item.shipped==false)
			return "Waiting to Ship";
		else
			return "Shipped"
	}


    CurrentUser.getUserBuying($scope.page).success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;

				$scope.purchase_list = true;
   				$scope.list_progress = false;
   				$scope.prevDisabled = true;
   				if ($scope.products.length <= 10)
						$scope.nextDisabled = true;
				else {
					$scope.nextDisabled = false;
					$scope.products.pop();
				}
		}
    }).error(function(data){
    	$state.go("app.login");
    });


}]);

webAppControllers.controller('SellController', ['$scope',  '$state', '$http', '$window', '$rootScope', 'CurrentUser','$mdDialog', function($scope, $state, $http, $window, $rootScope, CurrentUser,$mdDialog) {
	$scope.selling_list = false;
   	$scope.list_progress = true;

   	$scope.page = 0;

   	$scope.PrevList = function(){
	


	    $scope.nextDisabled = false;

	  	$scope.selling_list = false;
   		$scope.list_progress = true;
	    $scope.page = $scope.page-1;
	    if ($scope.page == 0) 
	    	$scope.prevDisabled = true;
	  
	    CurrentUser.getUserSelling($scope.page).success(function(data){
	    	$scope.products = data.data;
		    $scope.selling_list = true;
	   		$scope.list_progress = false;
	   		$scope.products.pop();
	    });
	};

	$scope.NextList = function(){
	    $scope.page=$scope.page+1;
	  	$scope.selling_list = false;
   		$scope.list_progress = true;
   		$scope.prevDisabled = false;
	    CurrentUser.getUserSelling($scope.page).success(function(data){
	 		$scope.selling_list = true;
   			$scope.list_progress = false;

	    	$scope.products = data.data;
	    	if ($scope.products.length <= 10)
				$scope.nextDisabled = true;
			else {
				$scope.nextDisabled = false;
				$scope.products.pop();
			}
	    });

	};


	CurrentUser.getUserSelling($scope.page).success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;

			$scope.selling_list = true;
   			$scope.list_progress = false;
   			$scope.prevDisabled = true;
			if ($scope.products.length <= 10)
					$scope.nextDisabled = true;
			else {
				$scope.nextDisabled = false;
				$scope.products.pop();
			}
		}
    }).error(function(data){
    	$state.go("app.login");
    });
  

  	$scope.showConfirm = function(ev,productid) {
    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	          .title('Would you like to delete this product?')
	          .textContent('This action cannot be undone.')
	          .targetEvent(ev)
	          .ok('Delete')
	          .cancel('Cancel');

	    $mdDialog.show(confirm).then(function() {
	      $scope.deleteItemPart1(productid);
	    });
	  };

	  $scope.showConfirm_ship = function(ev,productid,item) {
    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	          .title('Confirm that you are shipping this item.')
	          .textContent('This action cannot be undone.')
	          .targetEvent(ev)
	          .ok('Ship')
	          .cancel('Cancel');

	    $mdDialog.show(confirm).then(function() {
	      var temp = {};
	      temp.shipped = true;
	      temp.img="keep_current";
	      CurrentUser.editProductinfo(productid,temp);
	      item.shipped = true;

	    });
	  };


    $scope.deleteItemPart1 = function(productid) {
    	
		
	    CurrentUser.deleteProduct(productid);
    	$('#'+productid).remove();
	   
    }

}]);

webAppControllers.controller('WatchingController', ['$scope', '$state', '$http', '$rootScope', 'CurrentUser','$mdDialog', function($scope, $state, $http,$rootScope, CurrentUser,$mdDialog) {
    $scope.watching_list = false;
   	$scope.list_progress = true;

   	$scope.page = 0;

   	
   	$scope.PrevList = function(){

	    $scope.watching_list = false;
   		$scope.list_progress = true;
	    $scope.page = $scope.page-1;

	    if ($scope.page == 0)
	    	$scope.prevDisabled = true;
	    $scope.nextDisabled = false;
	  
	    CurrentUser.getUserWatching($scope.page).success(function(data){
	    	$scope.products = data.data;
	    	$scope.products.pop();
	    	$scope.watching_list = true;
   			$scope.list_progress = false;
	    });
	};

	$scope.NextList = function(){
	    $scope.page=$scope.page+1;
		$scope.watching_list = false;
   		$scope.list_progress = true;
   		$scope.prevDisabled = false;
	    CurrentUser.getUserWatching($scope.page).success(function(data){
	 		$scope.watching_list = true;
   			$scope.list_progress = false;

	    	$scope.products = data.data;
	    	if ($scope.products.length <= 10)
				$scope.nextDisabled = true;
			else {
				$scope.nextDisabled = false;
				$scope.products.pop();
			}
	    });

	};

	$scope.showConfirm = function(ev,productid) {
    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	          .title('Would you like to purchase this product?')
	          .textContent('Your credit card will be charged if you click \'Purchase\'.')
	          .targetEvent(ev)
	          .ok('Purchase')
	          .cancel('Cancel');

	    $mdDialog.show(confirm).then(function() {
	      $scope.buy_refresh(productid);
	    });
	  };


    CurrentUser.getUserWatching($scope.page).success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;

			$scope.watching_list = true;
   			$scope.list_progress = false;
   			$scope.prevDisabled = true;
   			if ($scope.products.length <= 10)
				$scope.nextDisabled = true;
			else {
				$scope.nextDisabled = false;
				$scope.products.pop();
			}

		}
    }).error(function(data){
    	$state.go("app.login");
    });

    $scope.unwatch_refresh = function(productid){
    	for(var i=0; i<$scope.products.length; i++){
    		if ($scope.products[i]._id == productid){
    			$scope.products.splice(i,1);
    			break;
    		}
    	}
    	CurrentUser.unwatchProduct(productid);


    }

    $scope.buy_refresh = function(productid){
    	for(var i=0; i<$scope.products.length; i++){
    		if ($scope.products[i]._id == productid){
    			$scope.products.splice(i,1);
    			break;
    		}
    	}
    	CurrentUser.buyProduct(productid);
    }

}]);


webAppControllers.controller('AccountController', ['$scope', '$http' , '$window' , '$rootScope', '$state', 'CurrentUser', function($scope, $http, $window, $rootScope, $state, CurrentUser) {
	$scope.loading = 1;
	$scope.phoneShow = false;
	$scope.addressShow = false;
	$scope.cardShow= false;
	$scope.passwordShow= false;
	$scope.ErrorMsg = "";

	$scope.updatePhone = function(){
		$scope.ErrorMsg = ""
		if ($scope.TempPhone.match(/\d/g).length===10){
			$scope.ErrorMsg = ""
			$scope.phoneShow = false;
			$scope.user.mobilePhone = $scope.TempPhone;
			CurrentUser.editUserinfo($scope.user);
		}
		else
			$scope.ErrorMsg = "Please enter 10 digits for your phone number!";


	}

	$scope.updateAddress = function(){
		$scope.ErrorMsg = ""
		if($scope.newaddress.zipcode.match(/\d/g).length===5){
			$scope.newaddress.zipcode = parseInt($scope.newaddress.zipcode);
			$scope.ErrorMsg = "";
			$scope.addressShow = false;
			$scope.user.address = $scope.newaddress;
			CurrentUser.editUserinfo($scope.user);
		}

		else
			$scope.ErrorMsg = " Please enter 5 digits for your zipcode!";

	}

	$scope.updateCard = function(){
		//update card
		$scope.ErrorMsg = ""

		if ($scope.card.number && $scope.card.holderName && $scope.card.ExpireDate){
			$scope.ErrorMsg = "";
			$scope.cardShow = false;
			$scope.user.card= $scope.card;
			CurrentUser.editUserinfo($scope.user);
			var cardnumstring = $scope.card.number.toString();
			$scope.creditcardfourdig = 'XXXX-XXXX-XXXX-'+cardnumstring.substr(cardnumstring.length-4);
			return;
		}
		else{
			$scope.ErrorMsg = "Please fill up all the information!";
		}


	}

	$scope.updatePassword = function(){
		//update card
		$scope.ErrorMsg = ""

		if ($scope.password == $scope.confirmPassword){
			$scope.passwordShow = false;
			CurrentUser.changePassword($scope.user.email,$scope.password).error(function(data){
				$scope.ErrorMsg = "Unable to change password."
			})
		}
		else{
			$scope.ErrorMsg = "The passwords you entered do not match!";
		}


	}



	$scope.states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

	$scope.change = function(field){
		if (field == 1)
			$scope.phoneShow = !$scope.phoneShow;
		if (field == 2)
			$scope.addressShow = !$scope.addressShow;
		if (field == 3)
			$scope.cardShow = !$scope.cardShow;
		if (field == 4)
			$scope.passwordShow = !$scope.passwordShow;
	}

	$scope.creditcardfourdig;
	
    CurrentUser.getAccountInfo().success(function(data) {
		if(data.message=="OK") {
			CurrentUser.getUserSellingCount().success(function(data2) {
		    	CurrentUser.getUserWatchingCount().success(function(data3) {
		    		CurrentUser.getUserBuyingCount().success(function(data4) {
		    			$scope.buyCount = data4.data;
		    		});
		    		$scope.watchCount = data3.data;
		    	});
		    	$scope.sellCount = data2.data;
		    });
		    $scope.user = data.data;
			$scope.newaddress = $scope.user.address;
			$scope.newaddress.zipcode = $scope.newaddress.zipcode.toString();
			$rootScope.account = "My Account";
			$scope.TempPhone =  data.data.mobilePhone;

			$scope.loading = 0;	
			var cardnumstring = data.data.card.number.toString();
			if (data.data.card)
				$scope.creditcardfourdig = 'XXXX XXXX XXXX '+cardnumstring.substr(cardnumstring.length-4);
		}

    })
    .error(function(data){
    	$state.go("app.login");
    });
}]);

webAppControllers.controller('SignupController', ['$scope' , '$state', 'CurrentUser', function($scope, $state, CurrentUser) {
	$scope.user;
	$scope.useremaillist;
	$scope.duplicate = false;

	CurrentUser.getAllUser().success(function(data){
		$scope.useremaillist = data.data;

	})

	$scope.emailcheck = function(){
		$scope.duplicate = false;
		if($scope.user.email && $scope.useremaillist){
			for (i=0; i<$scope.useremaillist.length; i++){
				if ($scope.user.email == $scope.useremaillist[i].email)
					$scope.duplicate = true;
			}
		}
		else{
			$scope.duplicate = false;
		}
	}


	$scope.createUser = function(user, invalidEmail, noEmail, noPassword) {
		if (invalidEmail == null && noEmail == null && noPassword == null) {
			CurrentUser.createUser(user).success(function(data) {
				if(data.message=="OK") {
					$state.go("app");
				}
			});
		}
	};
}]);

webAppControllers.controller('CreateItemController', ['$scope', '$state', 'CurrentUser', 'Upload', function($scope, $state, CurrentUser, Upload) {
	$scope.submitting = 0;
	$scope.product;
	$scope.categories = ["Baby Products (Excluding Apparel)","Beauty","Books","Camera & Photo","Cell Phones","Clothing & Accessories","Collectible Coins","Collectibles (Books)","Collectibles (Entertainment)","Electronics (Accessories)","Electronics (Consumer)","Fine Art","Grocery & Gourmet Food","Handmade","Health & Personal Care","Historical & Advertising Collectibles","Home & Garden","Industrial & Scientific","Jewelry","Luggage & Travel Accessories","Music","Musical Instruments","Office Products","Outdoors","Personal Computers","Shoes, Handbags & Sunglasses","Software & Computer Games","Sports","Sports Collectibles","Tools & Home Improvement","Toys & Games","Video, DVD & Blu-Ray","Video Games & Video Game Consoles","Watches","Wine"]
	$scope.ErrorMsg="";
	$scope.createItem = function (product) {
		
		if (product.reservePrice > product.startPrice){
			$scope.ErrorMsg = "Your starting price should be higher than reserve price!";
			return;
		}




		$scope.submitting = 1;
		$scope.product.currentPrice = $scope.product.startPrice;
		Upload.upload({
			url: '/auth/products',
			data: $scope.product
		}).success(function(){
			$scope.ErrorMsg="";
			$scope.submitting = 0;
			$state.go("app.sell");
		}).error(function(){
			$scope.submitting = 0;
			$ErrorMsg = "Some datas in your form is wrong!"
		})
	};
}]);

webAppControllers.controller('EditItemController', ['$scope', '$state', 'CurrentUser', '$stateParams', 'Upload', function($scope, $state, CurrentUser, $stateParams,Upload) {
	$scope.categories = ["Baby Products (Excluding Apparel)","Beauty","Books","Camera & Photo","Cell Phones","Clothing & Accessories","Collectible Coins","Collectibles (Books)","Collectibles (Entertainment)","Electronics (Accessories)","Electronics (Consumer)","Fine Art","Grocery & Gourmet Food","Handmade","Health & Personal Care","Historical & Advertising Collectibles","Home & Garden","Industrial & Scientific","Jewelry","Luggage & Travel Accessories","Music","Musical Instruments","Office Products","Outdoors","Personal Computers","Shoes, Handbags & Sunglasses","Software & Computer Games","Sports","Sports Collectibles","Tools & Home Improvement","Toys & Games","Video, DVD & Blu-Ray","Video Games & Video Game Consoles","Watches","Wine"]

	CurrentUser.getProductInfo($stateParams.item_id).success(function(data) {
		if(data.message=="OK") {
			$scope.product = data.data;
			$scope.product.img_replace="keep_current";
		}
	});
	$scope.submitting = 0;
	$scope.updateItem = function (product) {
		if($scope.product.img_replace=="keep_current")
			$scope.product.img = "keep_current";
		$scope.submitting = 1;
		Upload.upload({
			url: '/auth/products/'+$stateParams.item_id,
			data: $scope.product,
			method: 'PUT'
		}).success(function(){
			$scope.submitting = 0;
			$state.go("app.sell");
		}).error(function(){
			$scope.submitting = 0;
		})
	};

	$scope.changeImage = function() {
		$scope.product.img_replace = "";
	}

}]);


webAppControllers.controller('ItemDetailsController', ['$scope', '$state', '$rootScope', 'CurrentUser', '$stateParams','$window', '$mdDialog',function($scope, $state, $rootScope, CurrentUser, $stateParams, $window,$mdDialog) {

	// $('#watch').hide();
	// $('#unwatch').hide();
	var seller = 0;

	$scope.watch = false;
	$scope.unwatch = false;
	$scope.itemdetail = false; 
	$scope.buy = false;
	$scope.detail_progress =true; 
	$scope.buyer = false;
	$scope.sold = false;
		

	CurrentUser.getProductInfo($stateParams.item_id).success(function(data) {
		
		if(data.message=="OK") {
			$scope.product = data.data;
			var user = JSON.parse($window.sessionStorage.userdata);
			if(typeof user != 'undefined' && ($scope.product).sold==false){
				if($scope.product.sellerUser == user._id){
						seller = 1;
				}
			
				if (($scope.product.usersWatching).indexOf(user._id)!=-1){
					$scope.unwatch = true;
					$scope.buy = true;
				}

				else{
					if (!seller){
						$scope.watch = true;
						$scope.buy = true;
					}
				}

			}

			if(typeof user != 'undefined' && ($scope.product).sold==true){
				if($scope.product.soldToUser == user._id){
					$scope.buyer = true;
				}

				else{

					$scope.sold = true;
				}


			}

		
		}

		$scope.detail_progress = false;
		$scope.itemdetail = true;
	});


	$scope.click_watch = function(productid){

		CurrentUser.watchProduct(productid);
		$scope.watch = false;
		$scope.unwatch = true;

	};

	$scope.click_unwatch = function(productid){
		CurrentUser.unwatchProduct(productid);
		$scope.watch = true;
		$scope.unwatch = false;
	};

	$scope.click_buy = function(productid){
		CurrentUser.buyProduct(productid);
		$state.go("app.buy");

	};


	$scope.showConfirm = function(ev,productid) {
    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	          .title('Would you like to purchase this product?')
	          .textContent('Your credit card will be charged if you click \'Purchase\'.')
	          .targetEvent(ev)
	          .ok('Purchase')
	          .cancel('Cancel');

	    $mdDialog.show(confirm).then(function() {
	      $scope.click_buy(productid);
	    });
	  };


}]);

webAppControllers.controller('UserDetailsController', ['$scope', '$state', 'CommonData', '$stateParams', function($scope, $state, CommonData, $stateParams) {
	$scope.loading1 = 1;
	$scope.loading2 = 1;
	CommonData.getUserInfo($stateParams.user_id).success(function(data){
		$scope.loading1=0;
		if(data.message=="OK") {
			$scope.user = data.data;
		}
	})

	CommonData.getUserSellingProducts($stateParams.user_id,1).success(function(data) {
		$scope.loading2=0;
		if(data.message=="OK") {
			$scope.userProducts = data.data;
		}
	});
	
	
}]);



