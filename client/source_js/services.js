var webAppServices = angular.module('webAppServices', []);

webAppServices.factory('CommonData', function($http){

    return{
       getAllproducts : function() {
			return $http.get("/api/products");
		}
    }
});

webAppServices.factory('CurrentUser', function($http) {
	return {
		userLogout : function() {
			return $http.get("/auth/logout");
		},
		getSampleUser : function() {
			return $http.get('/api/users?select={"email":1,"_id":0}&limit=1&skip=' + Math.floor((Math.random() * 10)));
		},
		getUserBuying : function() {
			return $http.get('/auth/products/buying');
		},
		getUserSelling : function() {
			return $http.get('/auth/products/selling');
		},
		getUserWatching : function() {
			return $http.get('/auth/products/watching');
		},
		getAccountInfo : function() {
			return $http.get('/auth/user');
		},
		getProductInfo : function(productId) {
			return $http.get('/api/products/' + productId);
		},
		userLogin : function(loginDetails) {
			return $http.post('/auth/login', loginDetails);
		},
		createUser : function(user) {
			return $http.post('/auth/signup', user);
		},
		createListing : function(product) {
			return $http.post('/auth/products/selling');
		}, 
		editListing : function(product) {
			return $http.put('/api/products/' + product._id);
		}
	}
});

