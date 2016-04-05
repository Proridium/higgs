// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory

// Setup gulp help
require('gulp-help')(require('gulp'));

// Require all tasks
require('require-dir')('build/tasks');
