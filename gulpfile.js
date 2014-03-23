'use strict';

/*********************************************************************************
 *  https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js  *
 *********************************************************************************/
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var ngHtml2Js = require('gulp-ng-html2js');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');

var green = gutil.colors.green;
var lr = require('tiny-lr');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname + '/dist';
var LIVERELOAD_PORT = 35729;


/********************************
 * Main Tasks                   *
 ********************************/
gulp.task('default', ['build-dev'], function() {
   // fix initial change not updating bug
   gulp.start('sub:copy-dev', 'sub:build-templates', 'sub:webpack-build-dev');
});
gulp.task('build', ['sub:copy', 'sub:build-templates', 'sub:webpack-build'], function () {});
gulp.task('build-dev', ['sub:copy-dev', 'sub:build-templates', 'sub:webpack-build-dev'], function() {
   startExpress();
   startLivereload();

   gulp.watch(['./css/app.css'], function(event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));
      gulp.start('sub:copy-dev', function() {
         event.path = EXPRESS_ROOT + '/css/app.css';
         notifyLivereload(event);
      });
   });
   gulp.watch(['controllers/*', 'app.js'], function (event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));
      gulp.start('sub:webpack-build-dev', function() {
         event.path = EXPRESS_ROOT + '/common.js';
         notifyLivereload(event);
      });
   });
   gulp.watch(['partials/*', 'index.html'], function (event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));
      gulp.start('sub:build-templates', function () {
         gulp.src('./index.html').pipe(gulp.dest('./dist'));
         if (fileName === 'index.html') {
            event.path = EXPRESS_ROOT + '/index.html';
         } else {
            event.path = EXPRESS_ROOT + '/partials/templates.js';
         }
         notifyLivereload(event);
      });
   });
});


/********************************
 * Subtasks                     *
 ********************************/
gulp.task('sub:copy', function() {
   gulp.src('./bower_components/angular/angular.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-route/angular-route.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-bootstrap/ui-bootstrap.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/bootstrap/js/collapse.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./css/app.css').pipe(gulp.dest('./dist/css'));
   gulp.src('./index.html').pipe(gulp.dest('./dist'));
   gulp.src('./server.js').pipe(gulp.dest('./dist'));
});
gulp.task('sub:copy-dev', function() {
   gulp.src('./bower_components/angular/angular.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-route/angular-route.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-bootstrap/ui-bootstrap.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/bootstrap/js/collapse.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./css/app.css').pipe(minifyCSS()).pipe(gulp.dest('./dist/css'));
   gulp.src('./index.html').pipe(gulp.dest('./dist'));
});
gulp.task('sub:build-templates', function() {
   gulp.src('./partials/*.tpl.html')
      .pipe(ngHtml2Js({
         moduleName: 'MyAwesomePartials',
         prefix: '/partials/',
         rename: function(url) { return url.replace('.tpl.html', '.html'); }
      }))
      .pipe(concat('templates.js'))
      .pipe(uglify())
//      .pipe(rename('templates.js'))
      .pipe(gulp.dest('./dist/partials/'));
});


/********************************
 * Webpack                      *
 ********************************/
gulp.task('sub:webpack-build', function (callback) {
   var config = Object.create(webpackConfig);
   config.plugins = config.plugins.concat(
//      new webpack.DefinePlugin({
//         "process.env": {
//            "NODE_ENV": JSON.stringify("production")
//         }
//      }),
//      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
   );
   webpack(config, function (err, stats) {
      if (err) { throw new gutil.PluginError('webpack:build', err); }
      gutil.log('[webpack:build]', stats.toString({ colors: true }));
      callback();
   });
});

// modify some webpack config options
var devConfig = Object.create(webpackConfig);
devConfig.devtool = 'sourcemap';
devConfig.debug = true;
//devConfig.plugins = devConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());

// create a single instance of the compiler to allow caching
var devCompiler = webpack(devConfig);
gulp.task('sub:webpack-build-dev', function (callback) {
   return devCompiler.run(function(err, stats) {
      if(err) { throw new gutil.PluginError('webpack:build-dev', err); }
//      gutil.log('[webpack:build-dev]', stats.toString({ colors: true }));
      callback();
   });
});


/********************************
 * Livereload                   *
 ********************************/
// Let's make things more readable by encapsulating each part's setup in its own method
function startExpress() {
   var express = require('express');
   var app = express();
   app.use(require('connect-livereload')());
   app.use(express.static(EXPRESS_ROOT));
   app.get('*', function(req, res) {
      res.sendfile('./dist/index.html'); //, { env: env });
   });
   app.listen(EXPRESS_PORT);
}

function startLivereload() {
   lr = require('tiny-lr')();
   lr.listen(LIVERELOAD_PORT);
}

// Notifies livereload of changes detected by `gulp.watch()`
function notifyLivereload(event) {
   // `gulp.watch()` events provide an absolute path
   // so we need to make it relative to the server root
   var fileName = require('path').relative(EXPRESS_ROOT, event.path);
   lr.changed({
      body: {
         files: [fileName]
      }
   });
}