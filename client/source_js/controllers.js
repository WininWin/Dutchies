var webAppControllers = angular.module('webAppControllers', ['ngMaterial']);


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
webAppControllers.run(function($rootScope,$http,$state, CurrentUser) {
	$rootScope.loggedin = 0;
	$rootScope.account = "";
	$rootScope.loggingout = 0;
    $rootScope.logout = function() {
    	$rootScope.loggingout = 1;
        CurrentUser.userLogout().success(function(data){
        	$state.go('app');
        	$rootScope.userdata = {};
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
  	
	//After login, login button should changed to My Account
  


}]);

webAppControllers.controller('ContentController',['$scope' ,'$state','$http', '$rootScope', 'CommonData', 'CurrentUser', function($scope, $state, $http,$rootScope, CommonData, CurrentUser) {
		$scope.page = 0;
		$scope.sortselector = 'dateCreated';
		$scope.sortorder = 1;
		$scope.query= '';



		$scope.PrevList = function(){
		    if ($scope.page == 0) {
		    	$scope.prevDisabled = true;
		    	return;
		    }

			$scope.search_progress = true; 
			$scope.result = false;
		    $scope.page = $scope.page-1;
		  
		    CommonData.searchProducts($rootScope.result, $scope.page, $scope.sortselector,$scope.sortorder).success(function(data){
			      $scope.search_progress = false; 
				  $rootScope.search_products = data.data;
				  $scope.result = true;
				  $scope.nextDisabled = false;

		    });
		};

		$scope.NextList = function(){
			$scope.prevDisabled = false;
		    $scope.page=$scope.page+1;
		  	$scope.search_progress = true; 
			$scope.result = false;
		    CommonData.searchProducts($rootScope.result, $scope.page, $scope.sortselector,$scope.sortorder).success(function(data){
		 
				if (data.data.length==0){
					$scope.page=$scope.page-1;
					return;
				}
				$scope.search_progress = false; 
				$rootScope.search_products = data.data;
				$scope.result = true;
				if ($scope.search_products.length < 10)
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




		$scope.search = function(query){
			$scope.prevDisabled = true;
			$scope.search_progress = true; 
			$scope.result = false;
			if(typeof query != 'undefined' && query != ""){
				$state.go('app.search', {query: $scope.query })

			}
			else{
				$("#warning").text("Put at least 1 word");
				$scope.search_progress = false; 
			}
			
		};

		$scope.refresh = function(){
			$scope.page = 0;
			$scope.search_progress = true; 
			$scope.result = false;
			$scope.prevDisabled = true;
			CommonData.searchProducts($rootScope.result,$scope.page,$scope.sortselector,$scope.sortorder).success(function(data){
					//console.log(data.data);	
					$scope.search_progress = false; 
					$rootScope.search_products = data.data;
					$scope.result = true;
					if ($scope.search_products.length < 10)
						$scope.nextDisabled = true;
					else {
						$scope.nextDisabled = false;
						$rootScope.search_products.pop();
					}

			});


		}

		$scope.watchButton = function(productid){
			CurrentUser.watchProduct(productid);
		}



}]);

webAppControllers.controller('SearchController',['$scope' ,'$state','$http', '$rootScope', 'CommonData', 'CurrentUser', '$stateParams', function($scope, $state, $http,$rootScope, CommonData, CurrentUser, $stateParams) {
		$scope.page = 0;
		$scope.sortselector = 'dateCreated';
		$scope.sortorder = 1;
		$scope.query= '';



		$scope.PrevList = function(){
		    if ($scope.page == 0) {
		    	$scope.prevDisabled = true;
		    	return;
		    }

			$scope.search_progress = true; 
			$scope.result = false;
		    $scope.page = $scope.page-1;
		  
		    CommonData.searchProducts($rootScope.result, $scope.page, $scope.sortselector,$scope.sortorder).success(function(data){
			      $scope.search_progress = false; 
				  $rootScope.search_products = data.data;
				  $scope.result = true;
				  $scope.nextDisabled = false;

		    });
		};

		$scope.NextList = function(){
			$scope.prevDisabled = false;
		    $scope.page=$scope.page+1;
		  	$scope.search_progress = true; 
			$scope.result = false;
		    CommonData.searchProducts($rootScope.result, $scope.page, $scope.sortselector,$scope.sortorder).success(function(data){
		 
				if (data.data.length==0){
					$scope.page=$scope.page-1;
					return;
				}
				$scope.search_progress = false; 
				$rootScope.search_products = data.data;
				$scope.result = true;
				if ($scope.search_products.length < 10)
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
				$rootScope.result = query;
				CommonData.searchProducts($rootScope.result,$scope.page,$scope.sortselector,$scope.sortorder).success(function(data){
					//console.log(data.data);	
					$scope.search_progress = false; 
					$rootScope.search_products = data.data;
					$scope.result = true;
					console.log($rootScope.search_products.length);
					if ($scope.search_products.length < 10)
						$scope.nextDisabled = true;
					else {
						$scope.nextDisabled = false;
						$rootScope.search_products.pop();
					}

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
				$state.go('app.search', {query: $scope.query })

			}
			else{
				$("#warning").text("Put at least 1 word");
				$scope.search_progress = false; 
			}
			
		};

		$scope.query = $stateParams.query;
		$scope.performSearch($scope.query);

		$scope.refresh = function(){
			$scope.page = 0;
			$scope.search_progress = true; 
			$scope.result = false;
			$scope.prevDisabled = true;
			CommonData.searchProducts($rootScope.result,$scope.page,$scope.sortselector,$scope.sortorder).success(function(data){
					//console.log(data.data);	
					$scope.search_progress = false; 
					$rootScope.search_products = data.data;
					$scope.result = true;
					if ($scope.search_products.length < 10)
						$scope.nextDisabled = true;
					else {
						$scope.nextDisabled = false;
						$rootScope.search_products.pop();
					}

			});


		}

		$scope.watchButton = function(productid){
			CurrentUser.watchProduct(productid);
		}



}]);

webAppControllers.controller('FooterController',['$scope', '$state', function($scope,$state) {
 


}]);


webAppControllers.controller('LoginController',['$scope', '$state', '$http', '$rootScope', 'CurrentUser', function($scope,$state,$http,$rootScope, CurrentUser) {
	$scope.submitting = 0;
 	$scope.login = function() {
 		$scope.submitting = 1;
 		$scope.loginError = 0;
		var login_creds = {"email":$scope.email,"password":$scope.password};
	 	CurrentUser.userLogin(login_creds).success(function(data) {
	 		$scope.submitting = 0;
			if(!data.error) {
				$rootScope.userdata = data;
				$rootScope.loggedin = 1;
				$state.go("app.account");
			}

	   })
	 	.error(function(){
	 		$scope.submitting = 0;
	 		$scope.loginError = 1;
	 	});
	 }

	 // check if we are logged in, if not redirect to login
	if($rootScope.loggedin)
		$state.go("app.account");

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
	    if ($scope.page == 0) {
	    	$scope.prevDisabled = true;
	    	return;
	    }

	    $scope.page = $scope.page-1;
	  	$scope.purchase_list = false;
   		$scope.list_progress = true;
	    CurrentUser.getUserBuying($scope.page).success(function(data){
	    	$scope.products = data.data;
	    	$scope.purchase_list = true;
   			$scope.list_progress = false;
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
		    if (data.data.length==0){
		        $scope.page=$scope.page-1;
		        return;
		    }
		    $scope.products = data.data;
		    if ($scope.products.length < 10)
				$scope.nextDisabled = true;
			else {
				$scope.nextDisabled = false;
				$scope.products.pop();
			}
	    });

	};


    CurrentUser.getUserBuying($scope.page).success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;

				$scope.purchase_list = true;
   				$scope.list_progress = false;
   				$scope.prevDisabled = true;
   				if ($scope.products.length < 10)
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

webAppControllers.controller('SellController', ['$scope',  '$state', '$http', '$window', '$rootScope', 'CurrentUser', function($scope, $state, $http, $window, $rootScope, CurrentUser) {
	$scope.selling_list = false;
   	$scope.list_progress = true;

   	$scope.page = 0;

   	$scope.PrevList = function(){
	    if ($scope.page == 0) {
	    	$scope.prevDisabled = true;
	    	return;
	    }
	  	$scope.selling_list = false;
   		$scope.list_progress = true;
	    $scope.page = $scope.page-1;
	  
	    CurrentUser.getUserSelling($scope.page).success(function(data){
	    	$scope.products = data.data;
		    $scope.selling_list = true;
	   		$scope.list_progress = false;
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
	    	if (data.data.length==0){
	    	  $scope.page=$scope.page-1;
	    	  return;
	    	}
	    	$scope.products = data.data;
	    	if ($scope.products.length < 10)
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
			if ($scope.products.length < 10)
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

webAppControllers.controller('WatchingController', ['$scope', '$state', '$http', '$rootScope', 'CurrentUser', function($scope, $state, $http,$rootScope, CurrentUser) {
    $scope.watching_list = false;
   	$scope.list_progress = true;

   	$scope.page = 0;
   	
   	$scope.PrevList = function(){
	    if ($scope.page == 0) {
	    	$scope.prevDisabled = true;
	    	return;
	    }
	    $scope.watching_list = false;
   		$scope.list_progress = true;
	    $scope.page = $scope.page-1;
	  
	    CurrentUser.getUserWatching($scope.page).success(function(data){
	    	$scope.products = data.data;
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
	    	if (data.data.length==0){
	    	  $scope.page=$scope.page-1;
	    	  return;
	    	}
	    	$scope.products = data.data;
	    	if ($scope.products.length < 10)
				$scope.nextDisabled = true;
			else {
				$scope.nextDisabled = false;
				$scope.products.pop();
			}
	    });

	};


    CurrentUser.getUserWatching($scope.page).success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;

			 $scope.watching_list = true;
   			$scope.list_progress = false;
   			$scope.prevDisabled = true;
   			if ($scope.products.length < 10)
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


webAppControllers.controller('AccountController', ['$scope', '$http' , '$window' , '$rootScope', '$state', 'CurrentUser', function($scope, $http, $window, $rootScope, $state, CurrentUser) {
	
	$scope.phoneShow = false;
	$scope.addressShow = false;
	$scope.cardShow= false;
	$scope.ErrorMsg = "";



	$scope.updatePhone = function(){
		if ($scope.TempPhone.match(/\d/g).length===10){
			$scope.ErrorMsg = ""
			$scope.phoneShow = false;
			console.log("pass");
			$scope.user.mobilePhone = $scope.TempPhone;
			CurrentUser.editUserinfo($scope.user);
		}
		else
			$scope.ErrorMsg = "Please enter 10 digits for your phone number!";


	}

	$scope.updateAddress = function(){
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

		if ($scope.card.number && $scope.card.holderName && $scope.card.ExpireDate){
			$scope.ErrorMsg = "";
			$scope.cardShow = false;
			$scope.user.card= $scope.card;
			CurrentUser.editUserinfo($scope.user);
			var cardnumstring = $scope.card.number.toString();
			$scope.creditcardfourdig = 'XXXX XXXX XXXX '+cardnumstring.substr(cardnumstring.length-4);
			return;
		}
		else{
			$scope.ErrorMsg = "Please fill up all the information!";
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
	}

	$scope.creditcardfourdig;
	if($rootScope.userdata!=undefined)
		$scope.user = $rootScope.userdata;
    CurrentUser.getAccountInfo().success(function(data) {
		if(data.message=="OK") {
			$scope.user = data.data;
			$scope.newaddress = $scope.user.address;
			$scope.newaddress.zipcode = $scope.newaddress.zipcode.toString();
			$rootScope.userdata = data.data;
			$rootScope.account = "My Account";
			$scope.TempPhone =  data.data.mobilePhone;

	
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

webAppControllers.controller('CreateItemController', ['$scope', '$state', 'CurrentUser', function($scope, $state, CurrentUser) {
	
	$scope.product;
	$scope.createItem = function (product) {
		
		// CurrentUser.createListing(product).success(function(data) {
		// 	if (data.message == "OK") {
		// 		$state.go("app.sell");
		// 	}
		// });
	};
}]);

webAppControllers.controller('EditItemController', ['$scope', '$state', 'CurrentUser', '$stateParams', function($scope, $state, CurrentUser, $stateParams) {
	CurrentUser.getProductInfo($stateParams.item_id).success(function(data) {
		if(data.message=="OK") {
			$scope.product = data.data;
		}
	});
	$scope.updateItem = function (product) {
		// CurrentUser.editListing(product).success(function(data) {
		// 	if (data.message == "OK") {
		// 		$state.go("app.sell");
		// 	}
		// });
	};

}]);


webAppControllers.controller('ItemDetailsController', ['$scope', '$state', '$rootScope', 'CurrentUser', '$stateParams', function($scope, $state, $rootScope, CurrentUser, $stateParams) {

	// $('#watch').hide();
	// $('#unwatch').hide();
	var seller = 0;

	$scope.watch = false;
	$scope.unwatch = false;
	$scope.itemdetail = false; 
	$scope.buy = false;
	$scope.detail_progress =true; 
		

	CurrentUser.getProductInfo($stateParams.item_id).success(function(data) {
		

		if(data.message=="OK") {
			$scope.product = data.data;


			if(typeof $rootScope.userdata != 'undefined' && ($scope.product).sold==false){
				if($scope.product.sellerUser == $rootScope.userdata._id){
			
						seller = 1;
				}
			

				CurrentUser.getUserInfo($rootScope.userdata._id).success(function(data){
	
				$scope.userdata = data.data;
				//If user is already watching the product, the user does need watch button.
				if(typeof $scope.userdata!='undefined'){
					if(($scope.userdata.productsWatching).indexOf($stateParams.item_id) != -1){
						
						$scope.unwatch = true;
					}				
					else{
					
						if(!seller){
							$scope.watch = true; 
						}
						
					}
				}


		});
			}	

		}

		$scope.detail_progress = false;
		$scope.itemdetail = true; 
	});

	
	

	

	$scope.click_watch = function(productid){

		
		// //push to the user's watching list
		// (userdata.productsWatching).push($stateParams.item_id);

		// CurrentUser.editUserinfo(userdata).success(function(data) {
		// 	$scope.watch = false;
		// 	$scope.unwatch = true;
		// });

		// //push to the product's user list 
		// ($scope.product.usersWatching).push(userdata._id);

		// CurrentUser.editProductinfo($scope.product._id, $scope.product).success(function(data) {
		// 	console.log("Watched");
		// });
		CurrentUser.watchProduct(productid);

	};

	$scope.click_unwatch = function(userdata, item){

		//find item index in user's watching list
		var item_index = (userdata.productsWatching).indexOf($stateParams.item_id);

		//find user index in product's user list
		var user_index = (item.usersWatching).indexOf(userdata._id);

		//update the info
		if (item_index > -1) {
			    (userdata.productsWatching).splice(item_index, 1);
		}
		if(user_index > -1){
			(item.usersWatching).splice(user_index, 1);
		}

		CurrentUser.editUserinfo(userdata).success(function(data) {
			$scope.watch = true;
			$scope.unwatch = false;
		});

		CurrentUser.editProductinfo(item._id, $scope.product).success(function(data) {
			console.log("UnWatched");
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



