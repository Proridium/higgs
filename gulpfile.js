'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var fs = require('fs');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var EXPRESS_ROOT = path.join(__dirname, './public');
var RELOAD_PORT = 3005;

console.log(EXPRESS_ROOT);

function getFiles(dir) {
   var files = [];
   fs.readdirSync(dir)
      .filter(function (file) {
         if (!fs.statSync(path.join(dir, file)).isDirectory()
            && file.substring(0,1) !== '_' && file.substring(0,1) !== '.') {
            files.push(path.join(__dirname, dir, file));
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

var bowerComponents = [
   path.join(__dirname, './bower_components/angular/angular.js'),
   path.join(__dirname, './bower_components/angular/angular.js.map'),
   path.join(__dirname, './bower_components/angular-animate/angular-animate.js'),
   path.join(__dirname, './bower_components/angular-animate/angular-animate.js.map'),
   path.join(__dirname, './bower_components/angular-bootstrap/ui-bootstrap.js'),
   path.join(__dirname, './bower_components/angular-bootstrap/ui-bootstrap-tpls.js'),
   path.join(__dirname, './bower_components/angular-ui-router/release/angular-ui-router.js'),
   path.join(__dirname, './bower_components/angular-strap/dist/angular-strap.tpl.js'),
   path.join(__dirname, './bower_components/angular-strap/dist/modules/navbar.js')
];
var bowerComponentsMin = [
   path.join(__dirname, './bower_components/angular/angular.min.js'),
   path.join(__dirname, './bower_components/angular/angular.min.js.map'),
   path.join(__dirname, './bower_components/angular-animate/angular-animate.min.js'),
   path.join(__dirname, './bower_components/angular-animate/angular-animate.min.js.map'),
   path.join(__dirname, './bower_components/angular-bootstrap/ui-bootstrap.min.js'),
   path.join(__dirname, './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'),
   path.join(__dirname, './bower_components/angular-ui-router/release/angular-ui-router.min.js'),
   path.join(__dirname, './bower_components/angular-strap/dist/angular-strap.tpl.min.js'),
   path.join(__dirname, './bower_components/angular-strap/dist/modules/navbar.min.js')
];
var controllers = getFiles('./src/controllers');
var services = getFiles('./src/services');
var templates = getFiles('./src/partials');
var green = $.util.colors.green;

/********************************
 * Tasks                        *
 ********************************/
gulp.task('default', function() {
   gulp.start('build-dev');
});
gulp.task('build', function (callback) {
   console.log('Building production site...');
   runSequence(
      'sub:clean',
      ['sub:build-templates', 'sub:build-controllers', 'sub:build-services'],
      'sub:publish',
      'sub:browserify',
      callback);
});
gulp.task('build-dev', function(callback) {
   console.log('Building development site...');
   runSequence(
      'sub:clean',
      ['sub:build-templates-dev', 'sub:build-controllers-dev', 'sub:build-services-dev'],
      'sub:publish-dev',
      'sub:browserify-dev',
      callback);
});
gulp.task('debug', [], function() {
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
      $.util.log("Change detected: " + green(fileName));
      gulp.start('sub:publish-dev', function() {
         event.path = EXPRESS_ROOT + '/app.css';
         notifyLivereload(event);
      });
   });
   gulp.watch(angularWatch, function (event) {
      var aFile = event.path.split('/');
      var fileName = aFile[aFile.length-1];
      $.util.log("Change detected: " + green(fileName));

      // Rebuild bundle.js
      gulp.start('sub:browserify-dev', function() {
         event.path = EXPRESS_ROOT + '/common.js';
         notifyLivereload(event);
      });
   });
});
gulp.task('bump-minor', function() {
   gulp.src(['./package.json', './bower.json'])
      .pipe($.bump({type: 'minor'})).on('error', $.util.log)
      .pipe(gulp.dest('./'));
});
gulp.task('bump-patch', function(cb) {
   gulp.src(['./package.json', './bower.json'])
      .pipe($.bump({type: 'patch'}))
      .pipe(gulp.dest('./'));
   cb();
});

/********************************
 * Subtasks                     *
 ********************************/
gulp.task('sub:clean', function(cb) {
   if (fs.existsSync(EXPRESS_ROOT)) {
      var filesToDelete = getFiles('public');
      var libFolder = path.join(__dirname, '/public/lib');
      if (fs.existsSync(libFolder)) {
         filesToDelete = filesToDelete.concat(getFiles('public/lib'));
      } else {
         fs.mkdir(libFolder);
      }

      var _controllers = path.join(__dirname + '/src/controllers/_controllers.js');
      if (fs.existsSync(_controllers)) {
         filesToDelete = filesToDelete.concat(_controllers);
      }
      var _templates = path.join(__dirname + '/src/partials/_templates.js');
      if (fs.existsSync(_templates)) {
         filesToDelete = filesToDelete.concat(_templates);
      }
      var _services = path.join(__dirname + '/src/services/_services.js');
      if (fs.existsSync(_services)) {
         filesToDelete = filesToDelete.concat(_services);
      }

      if (filesToDelete.length > 0) {
         gulp.src(filesToDelete, {read: false}).pipe($.clean({ force: true }));
      }
   } else {
      fs.mkdir(EXPRESS_ROOT);
      fs.mkdir(EXPRESS_ROOT + '/lib');
   }
   cb();
});
gulp.task('sub:build-templates', function() {
   return gulp.src(templates)
      .pipe($.ngHtml2js({
         moduleName: 'app.templates',
         prefix: './partials/',
         rename: function(url) { return url.replace('.tpl.html', '.html'); }
      }))
      .pipe($.concat('_templates.js'))
      .pipe($.uglify())
      .pipe(gulp.dest(path.join(__dirname, './src/partials')))
      .pipe($.size({title: '[build-templates]'}));
});
gulp.task('sub:build-templates-dev', function() {
   return gulp.src(templates)
      .pipe($.ngHtml2js({
         moduleName: 'app.templates',
         prefix: './partials/',
         rename: function(url) { return url.replace('.tpl.html', '.html'); }
      }))
      .pipe($.concat('_templates.js'))
      .pipe(gulp.dest(path.join(__dirname, '/src/partials')))
      .pipe($.size({title: '[build-templates-dev]'}));
});
gulp.task('sub:build-controllers', function() {
   return gulp.src(controllers)
      .pipe($.concat('_controllers.js'))
      .pipe($.insert.prepend('angular.module(\'app.controllers\', []);\r'))
      .pipe($.ngMin())
      .pipe(gulp.dest('./src/controllers'))
      .on('error', $.util.log)
      .pipe($.size({title: '[build-controllers]'}));
});
gulp.task('sub:build-services', function() {
   return gulp.src(services)
      .pipe($.concat('_services.js'))
      .pipe($.insert.prepend('angular.module(\'app.services\', []);\r'))
      .pipe($.ngMin())
      .pipe(gulp.dest(path.join(__dirname, '/src/services')))
      .on('error', $.util.log)
      .pipe($.size({title: '[build-services]'}));
});
gulp.task('sub:build-controllers-dev', function() {
   return gulp.src(controllers)
      .on('error', $.util.log)
      .pipe($.concat('_controllers.js'))
      .pipe($.insert.prepend('angular.module(\'app.controllers\', []);\r'))
//      .pipe($.traceur({
//         experimental: true,
//         // sourceMap: true,
//         modules: 'register'
//      }))
      .pipe(gulp.dest(path.join(__dirname + '/src/controllers')))
      .pipe($.size({title: '[build-controllers-dev]'}));
});
gulp.task('sub:build-services-dev', function() {
   return gulp.src(services)
      .pipe($.concat('_services.js'))
      .pipe($.insert.prepend('angular.module(\'app.services\', []);\r'))
      .pipe(gulp.dest(path.join(__dirname + '/src/services')))
      .on('error', $.util.log)
      .pipe($.size({title: '[build-services-dev]'}));
});
gulp.task('sub:publish', function() {
//   console.log('Publishing: ' + bowerComponents);
   gulp.src(bowerComponentsMin)
      .pipe(gulp.dest(path.join(EXPRESS_ROOT + 'lib')));
   gulp.src('./src/styles/site.css')
      .pipe($.minifyCSS())
      .pipe(gulp.dest(EXPRESS_ROOT));
   gulp.src('src/*.jade')
      .pipe($.jade({
         locals: {
            env: 'production'
         }
      }))
      .pipe(gulp.dest('public/'));
});
gulp.task('sub:publish-dev', function() {
   gulp.src(bowerComponents)
      .pipe(gulp.dest(path.join(EXPRESS_ROOT, 'lib')));
   gulp.src('src/*.jade')
      .pipe($.jade({
         locals: {
            env: 'development'
         }
      }))
      .pipe(gulp.dest('public/'));
   gulp.src(path.join(__dirname, './src/styles/site.css'))
      .pipe(gulp.dest(EXPRESS_ROOT));
});
gulp.task('sub:publish-express', function() {
   gulp.src('./src/server.js').pipe(gulp.dest(EXPRESS_ROOT));
});


/********************************
 * Browserify                   *
 ********************************/
gulp.task('sub:browserify', ['sub:publish', 'sub:build-templates', 'sub:build-controllers', 'sub:build-services'], function() {
   gulp.src('./src/app.js')
      .pipe($.browserify({
         insertGlobals: true,
         debug: false
      }))
      .pipe($.uglify())
      .pipe($.concat('bundle.js'))
      .pipe(gulp.dest(EXPRESS_ROOT))
      .on('error', $.util.log)
      .pipe($.size({title: '[browserify]'}));
});
gulp.task('sub:browserify-dev', function() {
   gulp.src('./src/app.js')
      .pipe($.browserify({
         insertGlobals: true,
         debug: true
      }))
      .pipe($.concat('bundle.js'))
      .pipe(gulp.dest(EXPRESS_ROOT))
      .on('error', $.util.log)
      .pipe($.size({title: '[browserify-dev]'}));
});

/** web-starter-kit reload */
// Watch Files For Changes & Reload
gulp.task('serve', function () {
   browserSync.init(null, {
      server: {
         baseDir: ['public'],
         index: 'index.html'
      },
      online: false,
      port: RELOAD_PORT,
      notify: false
   });

   gulp.watch(['src/styles/*.css', 'src/**/*.jade', 'src/**/*.html'], ['sub:publish-dev']);
   gulp.watch([].concat(controllers, services, templates, 'src/app.js'), ['sub:browserify-dev']);
   gulp.watch(['public/**/*'], reload);
});