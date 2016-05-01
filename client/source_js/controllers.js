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
  	
	//After login, login button should chage to My Account
  	if($rootScope.loggedin){
  		$rootScope.account = "My Account";
  	}
  	else{
  		$rootScope.account = "Login";
  	}
  


}]);

webAppControllers.controller('ContentController',['$scope' ,'$state','$http', '$rootScope', 'CommonData', 'CurrentUser', function($scope, $state, $http,$rootScope, CommonData, CurrentUser) {


		
		//Get all products data for home contents 
		CommonData.getAllproducts().success(function(data) {
			if(data.message=="OK") {
				$scope.products = data.data;
				// console.log($scope.products);
				
			}
		});

		$scope.search = function(query){
			$state.go("app.searchresult");
			$rootScope.result = query;

		};
	
 




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

	if($rootScope.userdata!=undefined)
		$scope.user = $rootScope.userdata;
    CurrentUser.getAccountInfo().success(function(data) {
		if(data.message=="OK") {
			$scope.user = data.data;
			$rootScope.userdata = data.data;
			$rootScope.account = "My Account";
		}

    })
    .error(function(data){
    	$state.go("app.login");
    });


}]);

webAppControllers.controller('SignupController', ['$scope' , '$state', 'CurrentUser', function($scope, $state, CurrentUser) {
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


webAppControllers.controller('ItemDetailsController', ['$scope', '$state', 'CurrentUser', '$stateParams', function($scope, $state, CurrentUser, $stateParams) {
	CurrentUser.getProductInfo($stateParams.item_id).success(function(data) {
		if(data.message=="OK") {
			$scope.product = data.data;
		}
	});

}]);

webAppControllers.controller('UserDetailsController', ['$scope', '$state', 'CurrentUser', '$stateParams', function($scope, $state, CurrentUser, $stateParams) {
	
	CurrentUser.getUserInfo($stateParams.user_id).success(function(data) {
		if(data.message=="OK") {
			$scope.user = data.data;
			$scope.userProducts = []
			for (var i = 0; i < $scope.user.productsSelling.length; i++) {
				CurrentUser.getProductInfo($scope.user.productsSelling[i]).success(function(data2) {
					console.log(data2.data);
					if(data.message == "OK") {
						$scope.userProducts.push(data2.data);
					}
				});
			}
		}
	});
	
	
}]);



