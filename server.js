'use strict';

/** Module dependencies */
var express = require('express');
var path = require('path');
var log = require('./utils').logging;
var expressVersion = require('./node_modules/express/package.json').version;

/** Configure Express */
var app = express();
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;

var staticPath = path.join(__dirname, '/public');
app.set('views', path.join(__dirname, '/src'));
app.set('view engine', 'jade');
app.use(express.static(staticPath));

/** Routes */
app.get('/partials/:partialPath', function(req, res) {
   res.sendfile(path.join('./public/partials/', req.params.partialPath + '.html'));
});
app.get('/lib/*', function(req, res) {
   res.sendfile(path.join(__dirname, './public/', req.originalUrl));
});
app.get('*', function(req, res) {
   res.render('index', { env: env });
});

/** Start Express */
app.listen(port);
log.header('NodeJS ' + process.version);
log.subHeader2('ExpressJS v' + expressVersion  + ' server listening on port ' + port);
log.subHeader2('Environment: ' + env);