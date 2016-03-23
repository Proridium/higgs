var gulp = require('gulp-help')(require('gulp'));
var paths = require('../paths');
var del = require('del');
var vinylPaths = require('vinyl-paths');

// deletes all files in the output path
gulp.task('clean', 'Deletes all files in the output path', ['unbundle'], function() {
  return gulp.src([paths.output])
    .pipe(vinylPaths(del));
});
