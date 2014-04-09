'use strict';
require('./controllers/_controllers');
require('./partials/_templates');

module.exports = angular.module('app', ['ngAnimate', 'app.controllers', 'app.templates', 'ui.bootstrap', 'ui.router', 'mgcrea.ngStrap.navbar'])
   .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
      $locationProvider.html5Mode(true);
      $stateProvider
         .state('main', {url: '/main', templateUrl: './partials/main.html', controller: 'MainCtrl' })
         .state('products', {url: '/products', templateUrl: './partials/products.html', controller: 'ProductsCtrl' })
         .state('services', {url: '/services', templateUrl: './partials/services.html', controller: 'ServicesCtrl' })
         .state('partners', {url: '/partners', templateUrl: './partials/partners.html', controller: 'PartnersCtrl' })
         .state('about', {url: '/about', templateUrl: './partials/about.html', controller: 'AboutCtrl' });
      $urlRouterProvider
         .otherwise('/main');
   });