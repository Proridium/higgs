/**
 * Module dependencies.
 */
var express = require('express');
var app = express();

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Server route functions
 */
function serverTime (req, res){
   var date = new Date();
   res.send(date.toString());
}

/**
 * Configure Express
 */
app.use(express.static(__dirname.replace('/src', '/public/')));

/**
 * Routes
 */

//app.get('/controllers/:controllerName', function(req, res) {
//   res.sendfile('./controllers/' + req.params.controllerName);
//});
app.get('/partials/:partialPath', function(req, res) {
   res.sendfile('./partials/' + req.params.partialPath + '.html');
});
app.get('*', function(req, res) {
   res.sendfile('./index.html'); //, { env: env });
});

/**
 * Start Express
 */
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express server listening on port ' + port);