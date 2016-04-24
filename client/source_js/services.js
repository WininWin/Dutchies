var webAppServices = angular.module('webAppServices', []);

webAppServices.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
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
		userLogin : function(loginDetails) {
			return $http.post('/auth/login', loginDetails);
		}
	}
});

