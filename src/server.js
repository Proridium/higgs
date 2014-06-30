/** Module dependencies */
var express = require('express');
var path = require('path');

/** Configure Express */
var app = express();
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;
if (env === 'development') {
   app.use(express.static(path.join(__dirname.substr(0, __dirname.length - 3), '/public')));
}

/** Routes */
//app.get('/controllers/:controllerName', function(req, res) {
//   res.sendfile('./controllers/' + req.params.controllerName);
//});
app.get('/partials/:partialPath', function(req, res) {
   res.sendfile('./partials/' + req.params.partialPath + '.html');
});
app.get('*', function(req, res) {
   res.sendfile(path.join(__dirname, './public/index.html')); //, { env: env });
});

/** Start Express */
app.listen(port);
console.log('Express server listening on port ' + port);