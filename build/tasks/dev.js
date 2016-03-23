var gulp = require('gulp-help')(require('gulp'));
var tools = require('aurelia-tools');
var args = require('../args');

// source code for the tasks called in this file
// is located at: https://github.com/aurelia/tools/blob/master/src/dev.js

gulp.task('update-own-deps', 'Updates dependencies in this folder from folders in the parent directory', function() {
  tools.updateOwnDependenciesFromLocalRepositories(args.depth);
});

// quickly pulls in all of the aurelia
// github repos, placing them up one directory
// from where the command is executed,
// then runs `npm install`
// and `gulp build` for each repo
gulp.task('build-dev-env', 'Pulls in latest Aurelia, then runs `npm install` and `gulp build`', function() {
  tools.buildDevEnv();
});

// quickly pulls in all of the aurelia
// github repos, placing them up one directory
// from where the command is executed
gulp.task('pull-dev-env', false, function() {
  tools.pullDevEnv();
});
