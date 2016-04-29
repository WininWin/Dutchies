var webAppControllers = angular.module('webAppControllers', []);


//global functions
webAppControllers.run(function($rootScope,$http,$state) {
	$rootScope.loggedin = 0;
    $rootScope.logout = function() {
        $http.get("/auth/logout").success(function(data){
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


webAppControllers.controller('LoginController',['$scope', '$state', '$http', '$rootScope', function($scope,$state,$http,$rootScope) {
 	$scope.login = function() {
 		$scope.loginError = 0;
		var login_creds = {"email":$scope.email,"password":$scope.password};
	 	$http.post('/auth/login',login_creds).success(function(data) {
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

	$http.get('/api/users?select={"email":1,"_id":0}&limit=1&skip=' + Math.floor((Math.random() * 10))).success(function(data) {
		if(data.message=="OK") {
			$scope.sample_user = data.data[0].email;
			$scope.email = data.data[0].email;
		}
    });
 

}]);

webAppControllers.controller('BuyController', ['$scope', '$state' , '$http', function($scope, $state,$http) {
    $http.get('/auth/products/buying').success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
		}
    });


}]);

webAppControllers.controller('SellController', ['$scope', '$http', '$window' , function($scope, $http, $window) {
	$http.get('/auth/products/selling').success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
		}
    });
  

}]);

webAppControllers.controller('WatchingController', ['$scope' ,'$http', '$rootScope', function($scope,$http,$rootScope) {
    $http.get('/auth/products/watching').success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
		}
    });

}]);


webAppControllers.controller('AccountController', ['$scope', '$http' , '$window' , '$rootScope', '$state', function($scope, $http, $window, $rootScope, $state) {


	if($rootScope.userdata!=undefined)
		$scope.user = $rootScope.userdata;
    $http.get('/auth/user').success(function(data) {
		if(data.message=="OK") {
			$scope.user = data.data;
			$rootScope.userdata = data.data;
		}

    })
    .error(function(data){
    	$state.go("app.login");
    });


}]);

webAppControllers.controller('SignupController', ['$scope' , function($scope) {
  


}]);

webAppControllers.controller('ProductListController',['$scope','$http','$state',function($scope,$http,$state){
	

	$scope.formData = {};

	$scope.data = {}; //init variable
    $scope.click = function() { //default function, to be override if browser supports input type='file'
      $scope.data.alert = "Your browser doesn't support HTML5 input type='File'"
    }

    var fileSelect = document.createElement('input'); //input it's not displayed in html, I want to trigger it form other elements
    fileSelect.type = 'file';

    if (fileSelect.disabled) { //check if browser support input type='file' and stop execution of controller
      return;
    }
  
      $scope.click = function() { //activate function to begin input file on click
        fileSelect.click();
      }

      fileSelect.onchange = function() { //set callback to action after choosing file
        var f = fileSelect.files[0], r = new FileReader();

        r.onloadend = function(e) { //callback after files finish loading
          $scope.data.b64 = e.target.result;
          $scope.$apply();
          console.log($scope.data.b64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")); //replace regex if you want to rip off the base 64 "header"
          //here you can send data over your server as desired
          $scope.formData.img = $scope.data.b64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
        }

        r.readAsDataURL(f); //once defined all callbacks, begin reading the file

      };

	$scope.createproduct = function(){
		$http.post('/api/products',$scope.formData).success(function(data) {
			if(data.message=="OK") {
				console.log(data.data);
			}

    	})
	}

	
	$scope.uploadFile = function(files){
		var fd = new FormData();
		fd.append("file", files[0]);
		$scope.formData.img = files[0];

	}

	$http.get('/api/products').success(function(data) {
		if(data.message=="OK") {
			$scope.products = data.data;
			console.log($scope.products.length);
			$scope.imgproduct = $scope.products[$scope.products.length-1];
			
		
		}
    });




}]);



