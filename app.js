(function() {
   "use strict";
   module.exports = angular.module("app", ["ngRoute"])
      .config(['$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {
         console.log("Angular config running...");
         $locationProvider.html5Mode(true);
         $routeProvider
            .when('/main', {templateUrl: '/partials/main', controller: 'MainCtrl'})
            .when('/about', {templateUrl: '/partials/about', controller: 'AboutCtrl'})
            .otherwise({redirectTo: '/main'});
      }]);
})();