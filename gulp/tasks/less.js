var gulp = require('gulp');
var less = require('gulp-less');
var handleErrors = require('../util/handleErrors');
var config = require('../config').less;

gulp.task('less', function () {
  return gulp.src(config.src)
    .pipe( less() )
    .on('error', handleErrors)
    .pipe( gulp.dest(config.dest) )
});

// SASS
//
// var gulp = require('gulp');
// var sass = require('gulp-ruby-sass');
// var handleErrors = require('../util/handleErrors');
// var config = require('../config').sass;
//
// gulp.task('sass', ['images'], function () {
//   return gulp.src(config.src)
//   .pipe(sass({
//     compass: true,
//     bundleExec: true,
//     sourcemap: true,
//     sourcemapPath: '../sass'
//   }))
//   .on('error', handleErrors)
//   .pipe(gulp.dest(config.dest));
// });
