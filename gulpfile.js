'use strict';

/*********************************************************************************
 *  https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js  *
 *********************************************************************************/
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngHtml2Js = require('gulp-ng-html2js');
var webpack = require('webpack');
var Server = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

/********************************
 * Main Tasks                   *
 ********************************/
gulp.task('default', ['build-dev'], function() {});
gulp.task('build', ['sub:copy', 'webpack:build'], function () {});
gulp.task('build-dev', ['sub:copy-dev', 'sub:build-templates', 'webpack:build-dev', 'sub:filewatcher', 'webpack-dev-server'], function () {});

/********************************
 * Subtasks                     *
 ********************************/
gulp.task('sub:copy', function() {
   gulp.src('./bower_components/angular/angular.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-route/angular-route.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/bootstrap/js/collapse.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./css/app.css').pipe(gulp.dest('./dist/css'));
   gulp.src('./index.html').pipe(gulp.dest('./dist'));
   gulp.src('./server.js').pipe(gulp.dest('./dist'));
});
gulp.task('sub:copy-dev', function() {
   gulp.src('./bower_components/angular/angular.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/angular-route/angular-route.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/bootstrap/js/collapse.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('./dist/lib'));
   gulp.src('./css/app.css').pipe(gulp.dest('./dist/css'));
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
gulp.task('sub:filewatcher', function() {
   gulp.watch(['controllers/*'], function (event) {
      gulp.run('webpack:build-dev');
   });
   gulp.watch(['partials/*', 'index.html'], function (event) {
      gulp.run('sub:build-templates');
      gulp.src('./index.html').pipe(gulp.dest('./dist'));
   });
});

/********************************
 * Webpack & Webpack Dev Server *
 ********************************/
gulp.task('webpack:build', function (callback) {
   var config = Object.create(webpackConfig);
//   config.plugins = config.plugins.concat(
//      new webpack.DefinePlugin({
//         "process.env": {
//            "NODE_ENV": JSON.stringify("production")
//         }
//      }),
//      new webpack.optimize.DedupePlugin(),
//      new webpack.optimize.UglifyJsPlugin()
//   );
   webpack(config, function (err, stats) {
      if (err) { throw new gulpUtil.PluginError('webpack:build', err); }
      gulpUtil.log('[webpack:build]', stats.toString({ colors: true }));
      callback();
   });
});
gulp.task('webpack:build-dev', ['sub:copy-dev'], function (callback) {
   // modify some webpack config options
   var devConfig = Object.create(webpackConfig);
   devConfig.devtool = 'sourcemap';
   devConfig.debug = true;

   // create a single instance of the compiler to allow caching
   var devCompiler = webpack(devConfig);

   devCompiler.run(function(err, stats) {
      if(err) { throw new gulpUtil.PluginError('webpack:build-dev', err); }
      gulpUtil.log('[webpack:build-dev]', stats.toString({ colors: true }));
      callback();
   });
});
gulp.task("webpack-dev-server", function(callback) {
   // modify some webpack config options
   var myConfig = Object.create(webpackConfig);
   myConfig.devtool = "eval";
   myConfig.debug = true;

   var options = {
      contentBase: __dirname + "/dist"
   }

//   {
//      contentBase: __dirname + "/dist",
//      publicPath: "/" + myConfig.output.publicPath,
//      stats: {
//      colors: true
//   }

   // Start a webpack-dev-server
   new Server(webpack(myConfig), options)
      .listen(8080, "localhost", function(err) {
         if(err) { throw new gulpUtil.PluginError("webpack-dev-server", err); }
         gulpUtil.log("[webpack-dev-server]", "http://localhost:8080/index.html");
      });
});

/*******************************************************************
 *         http://www.shaundunne.com/gulp-is-the-new-black/        *
 *******************************************************************
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

gulp.task('stylus', function(){
   gulp.src('assets/stylus/main.styl')
      .pipe(stylus({
         use: ['nib'],
         compress: true
      }))
      .pipe(gulp.dest('assets/css'))
      .pipe(refresh(server));
});

gulp.task('js', function(){
   gulp.src('assets/js/*.js')
      .pipe(refresh(server));
})

gulp.task('php', function(){
   gulp.src('*.php')
      .pipe(refresh(server));
})

gulp.task('livereload', function(){
   server.listen(35729, function(err){
      if(err) { return console.log(err); }
   });
});

gulp.task('dev', function(){

   gulp.run('livereload', 'stylus');

   gulp.watch('assets/stylus/**' , function(ev) {
      gulp.run('stylus');
   });

   gulp.watch('assets/js/*.js', function(ev) {
      gulp.run('js');
   });

   gulp.watch('*.php', function(ev) {
      gulp.run('php');
   });

}); */

/********************************************************************************
 *  http://travismaynard.com/writing/no-need-to-grunt-take-a-gulp-of-fresh-air  *
 ********************************************************************************
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Lint JS
gulp.task('lint', function() {
   return gulp.src('src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('minify', function(){
   return gulp.src('src/*.js')
      .pipe(concat('all.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});

// Watch Our Files
gulp.task('watch', function() {
   gulp.watch('src/*.js', ['lint', 'minify']);
});

// Default
gulp.task('default', ['lint', 'minify', 'watch']); */