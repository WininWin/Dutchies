var app = angular.module('webApp', ['webAppControllers', 'webAppServices', 'ui.router']);


app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
 
  $stateProvider
  .state('app',{
    url: '/',
    views: {
      'header': {
        templateUrl: 'partials/header.html'
      },
      'content': {
        templateUrl: 'partials/content.html' 
      },
      'footer': {
        templateUrl: 'partials/footer.html'
      }
    }
  })

  .state('app.login', {
    url: 'login',
    views: {
      'content@': {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      }
    }
    
  })

  .state('app.searchresult', {
    url: 'searchresult',
    views: {
      'content@': {
        templateUrl: 'partials/searchresult.html',
        controller: 'ContentController'
      }
    }
    
  })



  .state('app.sell', {
    url: 'sell',
    views: {
      'content@': {
        templateUrl: 'partials/sell.html',
        controller: 'SellController'
      }
    }
    
  })
  
  .state('app.buy', {
    url: 'buy',
    views: {
      'content@': {
        templateUrl: 'partials/buy.html',
        controller: 'BuyController'
      }
    }
    
  })
  
  .state('app.watching', {
    url: 'watching',
    views: {
      'content@': {
        templateUrl: 'partials/watching.html',
        controller: 'WatchingController'    
      }
    }
    
  })

  .state('app.account', {
    url: 'account',
    views: {
      'content@': {
        templateUrl: 'partials/account.html',
        controller: 'AccountController'    
      }
    }
    
  })

  .state('app.signup', {
    url: 'signup',
    views: {
      'content@': {
        templateUrl: 'partials/signup.html',
        controller: 'SignupController'    
      }
    }
    
  })
 
  .state('app.createItem', {
    url: 'createItem',
    views: {
      'content@': {
        templateUrl: 'partials/createItem.html',
        controller: 'CreateItemController'
      }
    }
  }); 
 
}]);
