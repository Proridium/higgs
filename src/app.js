'use strict';
require('./controllers/_controllers');
require('./partials/_templates');

module.exports = angular.module('app', ['ngRoute', 'app.controllers', 'app.templates', 'ui.bootstrap'])
   .config(function ($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
         .when('/main', {templateUrl: './partials/main.html', controller: 'MainCtrl' })
         .when('/products', {templateUrl: './partials/products.html', controller: 'ProductsCtrl' })
         .when('/services', {templateUrl: './partials/services.html', controller: 'ServicesCtrl' })
         .when('/partners', {templateUrl: './partials/partners.html', controller: 'PartnersCtrl' })
         .when('/about', {templateUrl: './partials/about.html', controller: 'AboutCtrl' })
         .otherwise({redirectTo: '/main'});
   });