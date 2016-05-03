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
    $rootScope.logout = function() {
        CurrentUser.userLogout().success(function(data){
        	$state.go('app');
        	$rootScope.userdata = {};
        	$rootScope.loggedin = 0; 
        	$rootScope.account = "Login";
        });
    };


});



webAppControllers.controller('HeaderController',['$scope', '$state', '$rootScope', function($scope,$state, $rootScope) {
  	
	//After login, login button should changed to My Account
  	if($rootScope.loggedin){
  		$rootScope.account = "My Account";
  	}
  	else{
  		$rootScope.account = "Login";
  	}
  


}]);

webAppControllers.controller('ContentController',['$scope' ,'$state','$http', '$rootScope', 'CommonData', 'CurrentUser', function($scope, $state, $http,$rootScope, CommonData, CurrentUser) {

		$scope.recommended = [];

		$scope.progress = true;
		
		//Get all products data for home contents 
		CommonData.getAllproducts().success(function(data) {
			if(data.message=="OK") {
				$scope.products = data.data;
				$scope.progress = false;
			}
			for(var i = 0; i < 7; i++){
				var picker = Math.floor((Math.random() * $scope.products.length) + 1);
				$scope.recommended.push($scope.products[picker]);
			}
		});

		$scope.search = function(query){
		
			if(typeof query != 'undefined' && query != " "){
				$state.go("app.searchresult");
				$rootScope.result = query;

			}
			else{
				$("#warning").text("Put at least 1 word");
			}
			
		};

		 $scope.random = function() {
        return 0.5 - Math.random();
    		}
	
 




}]);

webAppControllers.controller('FooterController',['$scope', '$state', function($scope,$state) {
 


}]);


webAppControllers.controller('LoginController',['$scope', '$state', '$http', '$rootScope', 'CurrentUser', function($scope,$state,$http,$rootScope, CurrentUser) {
 	
 	$scope.login = function() {
 		$scope.loginError = 0;
		var login_creds = {"email":$scope.email,"password":$scope.password};
	 	CurrentUser.userLogin(login_creds).success(function(data) {
			if(!data.error) {
				$rootScope.userdata = data;
				$rootScope.loggedin = 1;
				$state.go("app.account");
			}

	   })
	 	.error(function(){
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
    CurrentUser.getUserBuying().success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
			$rootScope.account = "My Account";
		}
    }).error(function(data){
    	$state.go("app.login");
    });


}]);

webAppControllers.controller('SellController', ['$scope',  '$state', '$http', '$window', '$rootScope', 'CurrentUser', function($scope, $state, $http, $window, $rootScope, CurrentUser) {
	CurrentUser.getUserSelling().success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
			$rootScope.account = "My Account";
		}
    }).error(function(data){
    	$state.go("app.login");
    });
  

}]);

webAppControllers.controller('WatchingController', ['$scope', '$state', '$http', '$rootScope', 'CurrentUser', function($scope, $state, $http,$rootScope, CurrentUser) {
    CurrentUser.getUserWatching().success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
			$rootScope.account = "My Account";
		}
    }).error(function(data){
    	$state.go("app.login");
    });

}]);


webAppControllers.controller('AccountController', ['$scope', '$http' , '$window' , '$rootScope', '$state', 'CurrentUser', function($scope, $http, $window, $rootScope, $state, CurrentUser) {
	
	$scope.phoneShow = false;
	$scope.addressShow = false;
	$scope.cardShow= false;
	$scope.states =states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
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
			$rootScope.userdata = data.data;
			$rootScope.account = "My Account";
		console.log($scope.user.mobilePhone)
			//$scope.TempPhone = $scope.user.mobilePhone;
			var cardnumstring = data.data.card.number.toString();
			if (data.data.card)
				$scope.creditcardfourdig = '****-'+cardnumstring.substr(cardnumstring.length-4);
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
		console.log($scope.product.img);
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

	$('#watch').hide();
	$('#unwatch').hide();
	var seller = 0;
		

	CurrentUser.getProductInfo($stateParams.item_id).success(function(data) {
		

		if(data.message=="OK") {
			$scope.product = data.data;

			if($scope.product.sellerUser == $rootScope.userdata._id){
				$('#watch').hide();
				$('#unwatch').hide();
				$('#buy').hide();
				seller = 1;
			}
		}
	});

	if($rootScope.userdata != undefined){
		CurrentUser.getUserInfo($rootScope.userdata._id).success(function(data){
		//	console.log(data);
			$scope.userdata = data.data;
			//If user is already watching the product, the user does need watch button.
				if($scope.userdata!=undefined){
					if(($scope.userdata.productsWatching).indexOf($stateParams.item_id) != -1){
						
						$('#watch').hide();
						$('#unwatch').show();
					}				
					else{
					
						$('#unwatch').hide();
						if(!seller){
							$('#watch').show();
						}
						
					}
				}


		});
	}
	

	

	$scope.click_watch = function(userdata){

		
		//push to the user's watching list
		(userdata.productsWatching).push($stateParams.item_id);

		CurrentUser.editUserinfo(userdata._id, userdata).success(function(data) {
			$('#watch').hide();
			$('#unwatch').show();
		});

		//push to the product's user list 
		($scope.product.usersWatching).push(userdata._id);

		CurrentUser.editProductinfo($scope.product._id, $scope.product).success(function(data) {
			console.log("Watched");
		});


	};

	$scope.click_unwatch = function(userdata){

		//find item index in user's watching list
		var item_index = (userdata.productsWatching).indexOf($stateParams.item_id);

		//find user index in product's user list
		var user_index = ($scope.product.usersWatching).indexOf(userdata._id);

		//update the info
		if (item_index > -1) {
			    (userdata.productsWatching).splice(item_index, 1);
		}
		if(user_index > -1){
			($scope.product.usersWatching).splice(user_index, 1);
		}

		CurrentUser.editUserinfo(userdata._id, userdata).success(function(data) {
			$('#watch').show();
			$('#unwatch').hide();
		});

		CurrentUser.editProductinfo($scope.product._id, $scope.product).success(function(data) {
			console.log("UnWatched");
		});



	};






}]);

webAppControllers.controller('UserDetailsController', ['$scope', '$state', 'CurrentUser', '$stateParams', function($scope, $state, CurrentUser, $stateParams) {
	
	CurrentUser.getUserInfo($stateParams.user_id).success(function(data) {
		if(data.message=="OK") {
			$scope.user = data.data;
			console.log(data.data);
			$scope.userProducts = []
			for (var i = 0; i < $scope.user.productsSelling.length; i++) {
				CurrentUser.getProductInfo($scope.user.productsSelling[i]).success(function(data2) {
					if(data.message == "OK") {
						$scope.userProducts.push(data2.data);
					}
				});
			}
		}
	});
	
	
}]);



