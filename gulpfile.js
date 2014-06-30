'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var debug = require('gulp-debug');
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
var less = require('gulp-less');
var traceur = require('gulp-traceur');

var green = gutil.colors.green;
var lr = require('tiny-lr');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = path.join(__dirname, './public');
var LIVERELOAD_PORT = 35729;

console.log(EXPRESS_ROOT);

function getFiles(dir) {
//   var fullpath = path.join(__dirname, dir);
//   console.log("getFiles() for: " + fullpath);
   var files = [];
   fs.readdirSync(dir)
      .filter(function (file) {
         if (!fs.statSync(path.join(dir, file)).isDirectory()
            && file.substring(0,1) !== '_' && file.substring(0,1) !== '.') {
            files.push(path.join(dir,file));
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

var controllers = getFiles('./src/controllers');
var services = getFiles('./src/services');

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

   var angularWatch = getFiles('./src/controllers')
      .concat(getFiles('./src/services'))
      .concat(['./src/app.js', './src/config.js'])
      .concat(getFiles('./src/partials'))
      .concat(['.src/index.html']);

   gulp.watch(['./src/styles/site.css'], function(event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));
      gulp.start('sub:publish-dev', function() {
         event.path = EXPRESS_ROOT + '/app.css';
         notifyLivereload(event);
      });
   });
   gulp.watch(angularWatch, function (event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      gutil.log("Change detected: " + green(fileName));

      // Rebuild bundle.js
      gulp.start('sub:browserify-dev', function() {
         event.path = EXPRESS_ROOT + '/common.js';
         notifyLivereload(event);
      });
   });
});


/********************************
 * Subtasks                     *
 ********************************/
var bowerComponents = [
   './src/bower_components/angular/angular.min.js',
   './src/bower_components/angular-animate/angular-animate.min.js',
   './src/bower_components/angular-bootstrap/ui-bootstrap.min.js',
   './src/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
   './src/bower_components/angular-ui-router/release/angular-ui-router.min.js',
   './src/bower_components/angular-strap/dist/angular-strap.tpl.min.js',
   './src/bower_components/angular-strap/dist/modules/navbar.min.js'
];
var partials = getFiles('./src/partials');
gulp.task('sub:build-templates', function() {
   console.log("partials: " + partials);
   gulp.src(partials)
      .pipe(ngHtml2Js({
         moduleName: 'app.templates',
         prefix: './partials/',
         rename: function(url) { return url.replace('.tpl.html', '.html'); }
      }))
      .pipe(concat('_templates.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./src/partials'))
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
      .pipe(gulp.dest(__dirname + '/src/partials'))
      .pipe(size({title: '[build-templates-dev]'}));
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
//gulp.task('sub:ensureStyle', function () {
//   var siteCss = __dirname + '/styles/site.css';
//   if (!fs.existsSync(siteCss)) {
////      gutil.log('site.css missing!');
//      gulp.src(__dirname + '/styles/site.less')
//         .pipe(less())
//         .pipe(gulp.dest(__dirname + '/styles'));
////   } else {
////      gutil.log('site.css exists. :)');
//   }
//});
gulp.task('sub:publish', ['sub:clean-public'], function() {
   gulp.src(bowerComponents).pipe(gulp.dest(EXPRESS_ROOT + '/lib'));
   gulp.src('./src/styles/site.css')
      .pipe(minifyCSS())
      .pipe(gulp.src('./src/index.html'))
      .pipe(gulp.dest(EXPRESS_ROOT));
});
gulp.task('sub:publish-dev', ['sub:clean-public'], function() {
   gulp.src(bowerComponents)
      .pipe(gulp.dest(EXPRESS_ROOT + '/lib'));
   gulp.src(['./src/styles/site.css', './src/index.html'])
      .pipe(gulp.dest(EXPRESS_ROOT));
});
gulp.task('sub:publish-express', function() {
   gulp.src('./src/server.js').pipe(gulp.dest(EXPRESS_ROOT));
});
gulp.task('sub:build-controllers', function() {
   gulp.src(controllers)
      .pipe(concat('_controllers.js'))
      .pipe(insert.prepend('angular.module(\'app.controllers\', []);\r'))
      .pipe(ngMin())
      .pipe(gulp.dest('./src/controllers'))
      .on('error', gutil.log)
      .pipe(size({title: '[build-controllers-dev]'}));
});
gulp.task('sub:build-services', function() {
   gulp.src(services)
      .pipe(concat('_services.js'))
      .pipe(insert.prepend('angular.module(\'app.services\', []);\r'))
      .pipe(ngMin())
      .pipe(gulp.dest('./src/services'))
      .on('error', gutil.log)
      .pipe(size({title: '[build-services-dev]'}));
});
gulp.task('sub:build-controllers-dev', function() {
   gulp.src(controllers)
      .pipe(concat('_controllers.js'))
      .pipe(insert.prepend('angular.module(\'app.controllers\', []);\r'))
      .pipe(gulp.dest('./src/controllers'))
      .on('error', gutil.log)
      .pipe(size({title: '[build-controllers-dev]'}));
});
gulp.task('sub:build-services-dev', function() {
   gulp.src(services)
      .pipe(concat('_services.js'))
      .pipe(insert.prepend('angular.module(\'app.services\', []);\r'))
      .pipe(gulp.dest('./src/services'))
      .on('error', gutil.log)
      .pipe(size({title: '[build-services-dev]'}));
});


/********************************
 * Browserify                   *
 ********************************/
gulp.task('sub:browserify', ['sub:publish-express', 'sub:build-templates', 'sub:build-controllers', 'sub:build-services'], function() { // , 'sub:bump-minor'
   gulp.src('./src/app.js')
      .pipe(browserify({
         insertGlobals: true,
         debug: false
      }))
      .pipe(uglify())
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(EXPRESS_ROOT))
      .on('error', gutil.log)
      .pipe(size({title: '[browserify]'}));
});
gulp.task('sub:browserify-dev', ['sub:publish-dev', 'sub:build-templates-dev', 'sub:build-controllers-dev', 'sub:build-services-dev'], function() { //, 'sub:bump-patch'
   gulp.src('./src/app.js')
      .pipe(browserify({
         insertGlobals: true,
         debug: true
      }))
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(EXPRESS_ROOT))
      .on('error', gutil.log)
      .pipe(size({title: '[browserify-dev]'}));
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