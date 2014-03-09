(function() {
   "use strict";
   var app = require("../app.js");
   module.exports = app.controller("MainCtrl", ["$scope", function($scope) {
      console.log('MainCtrl is running.');
      $scope.message = "Hello from MainCtrl";
   }]);
})();
