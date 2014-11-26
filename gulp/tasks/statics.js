var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var config = require('../config').statics;

gulp.task('statics', function() {
  gulp.src([ './src/**/*', '!./src/assets/**', '!./src/**.html' ], { base: './src'})
    .pipe( gulp.dest('./build') )
});
