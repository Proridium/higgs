(function() {
   "use strict";
   var app = require("../app.js");
   module.exports = app.controller("ProductsCtrl", ["$scope", function($scope) {
      console.log('ProductCtrl is running.');
      $scope.message = "Hello from ProductCtrl";
   }]);
})();