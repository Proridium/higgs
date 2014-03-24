"use strict";
var app = require("../app.js");
module.exports = app.controller("ServicesCtrl", ["$scope", function($scope) {
   console.log('ServicesCtrl is running.');
   $scope.message = "Hello from ServicesCtrl";
}]);