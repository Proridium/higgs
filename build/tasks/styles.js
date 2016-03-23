var gulp = require('gulp-help')(require('gulp'));
var concat = require('gulp-concat');
var config = require('../../package.json').config;
var sass = require('gulp-sass');


gulp.task('styles', 'Transiles and bundles Sass', function() {
  return gulp.src(config.paths.styles)
    .pipe(sass())
    .pipe(concat('site.css'))
    .pipe(gulp.dest(config.paths.output));
});
