var webAppControllers = angular.module('webAppControllers', []);


//global functions
webAppControllers.run(function($rootScope,$http,$state, CurrentUser) {
	$rootScope.loggedin = 0;
    $rootScope.logout = function() {
        CurrentUser.userLogout().success(function(data){
        	$state.go('app');
        	$rootScope.userdata = {};
        	$rootScope.loggedin = 0; 
        });
    };
});



webAppControllers.controller('HeaderController',['$scope', '$state', function($scope,$state) {
  


}]);

webAppControllers.controller('ContentController',['$scope', '$state', function($scope,$state) {
 


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

webAppControllers.controller('BuyController', ['$scope', '$state' , '$http', 'CurrentUser', function($scope, $state,$http, CurrentUser) {
    CurrentUser.getUserBuying().success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
		}
    });


}]);

webAppControllers.controller('SellController', ['$scope', '$http', '$window', 'CurrentUser', function($scope, $http, $window, CurrentUser) {
	CurrentUser.getUserSelling().success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
		}
    });
  

}]);

webAppControllers.controller('WatchingController', ['$scope' ,'$http', '$rootScope', 'CurrentUser', function($scope,$http,$rootScope, CurrentUser) {
    CurrentUser.getUserWatching().success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
		}
    });

}]);


webAppControllers.controller('AccountController', ['$scope', '$http' , '$window' , '$rootScope', '$state', 'CurrentUser', function($scope, $http, $window, $rootScope, $state, CurrentUser) {


	if($rootScope.userdata!=undefined)
		$scope.user = $rootScope.userdata;
    CurrentUser.getAccountInfo().success(function(data) {
		if(data.message=="OK") {
			$scope.user = data.data;
			$rootScope.userdata = data.data;
		}

    })
    .error(function(data){
    	$state.go("app.login");
    });


}]);

webAppControllers.controller('SignupController', ['$scope' , '$location', 'CurrentUser', function($scope, $location, CurrentUser) {
	$scope.createUser = function(user, invalidEmail, noEmail, noPassword) {
		if (invalidEmail == null && noEmail == null && noPassword == null) {
			CurrentUser.createUser(user).success(function(data) {
				if(data.message=="OK") {
					$location.path('/account');
					console.log('created');
				}
			})
		}
	};
}]);

webAppControllers.controller('CreateItemController', ['$scope', function($scope) {
	$scope.createItem = function (product) {
		if (len(product.name) > 0 && product.starting > product.reserve && product.reserve > 0.00) {

		}
	};
}]);
