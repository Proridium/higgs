"use strict";
var app = require("../app.js");
module.exports = app.controller("PartnersCtrl", ["$scope", function($scope) {
   console.log('PartnersCtrl is running.');
   $scope.message = "Hello from PartnersCtrl";
}]);