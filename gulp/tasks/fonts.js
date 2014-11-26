var gulp = require('gulp');

gulp.task('fonts', function () {
  return gulp.src('./src/assets/fonts/**')
             .pipe( gulp.dest('./build/assets/fonts/') )
});
