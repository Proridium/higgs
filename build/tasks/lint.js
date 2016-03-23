var gulp = require('gulp-help')(require('gulp'));
var paths = require('../paths');
var tslint = require('gulp-tslint');
 
gulp.task('lint', 'Runs TSLint against source', function() {
  return gulp.src(paths.source)
    .pipe(tslint())
    .pipe(tslint.report('prose', {
      emitError: false
    }));
});