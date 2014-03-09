(function() {
   "use strict";
   var app = require("../app.js");
   module.exports = app.controller("AboutCtrl", ["$scope", function($scope) {
      console.log('AboutCtrl is running.');
      $scope.message = "Hello from AboutCtrl";
   }]);
})();
