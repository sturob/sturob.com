var gulp = require('gulp');

gulp.task('oldjs', function () {
  return gulp.src('./src/assets/js/lib/**')
             .pipe( gulp.dest('./build/assets/js/lib') )
});
