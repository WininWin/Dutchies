var webAppServices = angular.module('webAppServices', ['credit-cards','ngMaterial']);

webAppServices.factory('CommonData', function($http){

    return{
       getAllproducts : function() {
			return $http.get("/api/products");
		},
		mostWatchedProducts : function() {
			return $http.get('/api/products?where={sold:false}&sort={numUsersWatching:-1}&limit=6')
		},
		mostRecentProducts : function() {
			return $http.get('/api/products?where={sold:false}&sort={dateCreated:-1}&limit=4')
		},
		countProducts : function() {
			return $http.get('/api/products?where={sold:false}&count=1')
		},
		randomProducts : function(num,total) {
			count = total
			random = Math.floor(Math.random() * (count - num + 1));
			return $http.get('/api/products?where={sold:false}&sort={dateCreated:1}&limit=' + num + '&skip=' + random);
		},
		searchProducts : function(query,page,sortval,sortorder) {
			var skipnum  = 10*page;
			var querystring = '/api/products?where={name:{$in:[/'+query+'/i]},sold:false}&skip='+skipnum+'&limit=10&sort={'+sortval
				+':' + sortorder.toString() + '}';

			return $http.get(querystring);
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
		getAllUser : function() {
			return $http.get('/api/users?select={"email":1,"_id":0}');
		},
		getUserBuying : function(page) {
			var skipnum  = 10*page;
			return $http.get('/auth/products/buying?skip='+skipnum+'&limit=11&sort={dateSold:-1}');
		},
		getUserSelling : function(page) {
			var skipnum  = 10*page;

			return $http.get('/auth/products/selling?skip='+skipnum+'&limit=11&sort={dateCreated:-1}');
		},
		getUserWatching : function(page) {
			var skipnum  = 10*page;
			
			return $http.get('/auth/products/watching?skip='+skipnum+'&limit=11&sort={dateCreated:-1}');
		},
		getAccountInfo : function() {
			return $http.get('/auth/user');
		},
		getUserInfo : function(userId) {
			return $http.get('/api/users/' + userId);
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
		},
		editUserinfo : function(userid, data) {
			return $http.put('api/users/' + userid, data);
		},
		editProductinfo : function(productid, data){
			return $http.put('api/products/' + productid, data);
		}

	}
});

