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
		searchProducts : function(query,page,sortval,sortorder,filter) {

			var skipnum  = 10*page;
			
			if (filter == "All"){
				var querystring = '/api/products?where={name:{$in:[/'+query+'/i]},sold:false}&skip='+skipnum+'&limit=11&sort={"'+sortval
				+'":' + sortorder.toString() + '}';	
				return $http.get(querystring);
			}

			else{
				var querystring = '/api/products?where={name:{$in:[/'+query+'/i]},sold:false,category:"'+filter+'"}&skip='+skipnum+'&limit=11&sort={'+sortval
				+':' + sortorder.toString() + '}';

				console.log(querystring);
				return $http.get(querystring);
			}
			
		},

		searchProductsCount: function(query,page,sortval,sortorder,filter) {

			var skipnum  = 10*page;
			
			if (filter == "All"){
				var querystring = '/api/products?where={name:{$in:[/'+query+'/i]},sold:false}&skip='+skipnum+'&limit=11&sort={'+sortval
				+':' + sortorder.toString() + '}&count="true"';	
				console.log(querystring);
				return $http.get(querystring);
			}

			else{
				var querystring = '/api/products?where={name:{$in:[/'+query+'/i]},sold:false,category:"'+filter+'"}&skip='+skipnum+'&limit=11&sort={'+sortval
				+':' + sortorder.toString() + '}&count="true"';

				console.log(querystring);
				return $http.get(querystring);
			}
			
		},

		getUserSellingProducts : function(id,nopics) {
			console.log(id);

			var query = '/api/products?where={sellerUser:"'+id+'"}';
			console.log(query);
			if(nopics)
				query += '&select={_id:1,name:1,numUsersWatching:1}';
			return $http.get(query);
		},
		getUserInfo : function(id) {
			return $http.get('/api/users/'+id+'?select={name:1,email:1}');
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
		getUserBuyingCount : function(page) {
			return $http.get('/auth/products/buying?count=true');
		},
		getUserSellingCount : function(page) {
			return $http.get('/auth/products/selling?count=true');
		},
		getUserWatchingCount : function(page) {
			return $http.get('/auth/products/watching?count=true');
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
			return $http.post('/auth/products',product,{headers: {'Content-Type': undefined },transformRequest: angular.identity});
		}, 
		editListing : function(product) {
			return $http.put('/api/products/' + product._id,product);
		},
		editUserinfo : function(data) {
			return $http.put('/auth/user/update', data);
		},
		editProductinfo : function(productid, data){
			return $http.put('/auth/products/' + productid, data);
		},
		watchProduct : function(productid) {
			console.log(productid);
			return $http.put('/auth/products/watch/' + productid);	
		},
		unwatchProduct : function(productid){
			console.log(productid);
			return $http.put('/auth/products/unwatch/' + productid);
		},
		buyProduct : function(productid){
			return $http.put('/auth/products/buy/' + productid)
		},
		
		deleteProduct : function(productid) {
			return $http.delete('/auth/products/'+productid);
		},
		changePassword : function(email,password) {
			var temp = {};
			temp.email = email;
			temp.password = password;			
			return $http.post('/auth/password',temp);
		}
	}
});

