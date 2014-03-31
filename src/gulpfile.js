'use strict';
//http://www.jamescrowley.co.uk/category/coding/javascript/
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var ngHtml2Js = require('gulp-ng-html2js');
var ngMin = require('gulp-ngmin');
var size = require('gulp-size');
var insert = require('gulp-insert');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');

var green = gutil.colors.green;
var lr = require('tiny-lr');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname.replace('/src', '/public');
var LIVERELOAD_PORT = 35729;

function getFiles(dir) {
   var files = [];
   fs.readdirSync(dir)
      .filter(function (file) {
         if (!fs.statSync(path.join(dir, file)).isDirectory()
            && file.substring(0,1) !== '_') {
            files.push(dir + '/' + file);
         }
      });
   return files;
}
// shim string.contains()
if ( !String.prototype.contains ) {
   String.prototype.contains = function() {
      return String.prototype.indexOf.apply( this, arguments ) !== -1;
   };
}

/********************************
 * Main Tasks                   *
 ********************************/
gulp.task('default', ['sub:clean-public'], function() {
   // fix initial change not updating bug
   gulp.start('build-dev');
});
gulp.task('build', ['sub:browserify'], function () {});
gulp.task('build-dev', ['sub:browserify-dev'], function() {
   startExpress();
   startLivereload();

   var controllers = getFiles('./controllers').concat(['app.js', 'config.js']);
   var templates = getFiles('./partials').concat(['index.html'])  ;

   gulp.watch(['./app.css'], function(event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));
      gulp.start('sub:copy-dev', function() {
         event.path = EXPRESS_ROOT + '/app.css';
         notifyLivereload(event);
      });
   });
   gulp.watch(controllers, function (event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));
      gulp.start('sub:browserify-dev', function() {
         event.path = EXPRESS_ROOT + '/common.js';
         notifyLivereload(event);
      });
   });

   gulp.watch(templates, function (event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));
      gulp.start('sub:build-templates', function () {
         gulp.src('./index.html').pipe(gulp.dest('../public'));
         if (fileName === 'index.html') {
            event.path = EXPRESS_ROOT + '/index.html';
         } else {
            event.path = EXPRESS_ROOT + '/templates.js';
         }
         notifyLivereload(event);
      });
   });
});


/********************************
 * Subtasks                     *
 ********************************/
var bowerComponents = [
   './bower_components/angular/angular.min.js',
   './bower_components/angular-route/angular-route.min.js',
   './bower_components/angular-bootstrap/ui-bootstrap.min.js',
   './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
//   './bower_components/bootstrap/js/collapse.js',
//   './bower_components/jquery/dist/jquery.min.js',
//   './bower_components/bootstrap/dist/js/bootstrap.min.js'
];
var partials = getFiles('./partials');
gulp.task('sub:build-templates', function() {
   gulp.src(partials)
      .pipe(ngHtml2Js({
         moduleName: 'app.templates',
         prefix: './partials/',
         rename: function(url) { return url.replace('.tpl.html', '.html'); }
      }))
      .pipe(concat('_templates.js'))
      .pipe(uglify())
      .pipe(gutil.log('[build-templates]', size()))
      .pipe(gulp.dest('./partials'))
      .pipe(size({title: '[build-templates]'}));
});
gulp.task('sub:build-templates-dev', function() {
   gulp.src(partials)
      .pipe(ngHtml2Js({
         moduleName: 'app.templates',
         prefix: './partials/',
         rename: function(url) { return url.replace('.tpl.html', '.html'); }
      }))
      .pipe(concat('_templates.js'))
      .pipe(gulp.dest(__dirname + '/partials'))
      .pipe(size({title: '[build-templates]'}));
});
gulp.task('sub:bump-minor', function() {
   gulp.src(['./package.json', './bower.json'])
      .pipe(bump({type: 'minor'})).on('error', gutil.log)
      .pipe(gulp.dest('./'));
});
gulp.task('sub:bump-patch', function(cb) {
   gulp.src(['./package.json', './bower.json'])
      .pipe(bump({type: 'patch'}))
      .pipe(gulp.dest('./'));
   cb();
});
gulp.task('sub:clean-public', function(cb) {
   if (fs.existsSync(EXPRESS_ROOT)) {
      var filesToDelete = getFiles(EXPRESS_ROOT);
      if (fs.existsSync(EXPRESS_ROOT + '/lib')) {
         filesToDelete = filesToDelete.concat(getFiles(EXPRESS_ROOT + '/lib'));
      } else {
         fs.mkdir(EXPRESS_ROOT + '/lib');
      }
      if (filesToDelete.length > 0) {
         gulp.src(filesToDelete, {read: false}).pipe(clean({ force: true }));
      }
   } else {
      fs.mkdir(EXPRESS_ROOT);
      fs.mkdir(EXPRESS_ROOT + '/lib');
   }
   cb();
});
gulp.task('sub:publish', ['sub:clean-public'], function() {
   gulp.src(bowerComponents).pipe(gulp.dest('../public/lib'));
   gulp.src('./site.css')
      .pipe(minifyCSS())
      .pipe(gulp.src('./index.html'))
      .pipe(gulp.dest('../public'));
});
gulp.task('sub:publish-dev', ['sub:clean-public'], function() {
//   gutil.log(bowerComponents);
   gulp.src(bowerComponents).pipe(gulp.dest('../public/lib'));
   gulp.src(['./site.css', './index.html']).pipe(gulp.dest('../public'));
});
gulp.task('sub:publish-express', function() {
   gulp.src('./server.js').pipe(gulp.dest('../public'));
});


/********************************
 * Browserify                   *
 ********************************/
var scripts = getFiles(__dirname + '/controllers');
gulp.task('sub:browserify', ['sub:publish-express', 'sub:build-templates', 'sub:bump-minor'], function() {
   gulp.src(scripts)
      .pipe(concat('_controllers.js'))
      .pipe(insert.prepend('angular.module(\'app.controllers\', []);\r'))
      .pipe(ngMin())
      .pipe(gulp.dest('./controllers'))
      .pipe(gulp.src(['app.js'], {read: false}))
      .pipe(uglify())
      .pipe(browserify({
         insertGlobals: true,
         debug: true
      })).on('error', gutil.log)
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(EXPRESS_ROOT))
      .pipe(size({title: '[browserify]'}));
});
gulp.task('sub:browserify-dev', ['sub:publish-dev', 'sub:build-templates-dev', 'sub:bump-patch'], function() {
   gulp.src(scripts)
      .pipe(concat('_controllers.js'))
      .pipe(insert.prepend('angular.module(\'app.controllers\', []);\r'))
      .pipe(gulp.dest('./controllers'))
      .pipe(gulp.src(['app.js'], {read: false}))
      .pipe(browserify({
         insertGlobals: true,
         debug: true
      }))
      .on('error', gutil.log)
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(EXPRESS_ROOT))
      .pipe(size({title: '[browserify]'}));
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
      res.sendfile('index.html'); //, { env: env });
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