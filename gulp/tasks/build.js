var gulp = require('gulp');

gulp.task('build', ['browserify', 'less', 'images', 'markup', 'statics', 'oldjs', 'fonts' ]);
