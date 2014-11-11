var gulp       = require('gulp');
var less       = require('gulp-less');
// var changed    = require('gulp-changed');
var plumber    = require('gulp-plumber');
var htmlhint   = require('gulp-htmlhint');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('browser-sync', function() {
	browserSync.init(['assets/css/*.css', 'assets/js/*.js', '*.html'], {
		server: {
			baseDir: "./build"
		}
	});
});

gulp.task('base', function() {
	gulp.src(['./app/**/*', '!./app/assets/', '!./app/*.html'], { base: './app'})
		.pipe( gulp.dest('./build') )
});

gulp.task('less', function () {
	return gulp.src('./app/assets/less/*.less')
		.pipe( plumber() )
		.pipe( less() )
		.pipe( gulp.dest('./build/assets/css') )
		.pipe( reload({ stream:true }) );
});


gulp.task('html', function () {
	return gulp.src( './app/*.html' )
		.pipe( htmlhint() )
		.pipe( htmlhint.reporter() )
		.pipe( gulp.dest('./build') )
		.pipe( reload({stream:true}) );
});

gulp.task('images', function () {
	return gulp.src('./app/assets/images/**').pipe( gulp.dest('./build/assets/images') )
		.pipe( reload({stream:true}));
});

gulp.task('js', function () {
	return gulp.src('./app/assets/js/**').pipe( gulp.dest('./build/assets/js') )
		.pipe( reload({stream:true}));
});

gulp.task('build', [ 'base', 'less', 'images', 'html', 'js' ]);

gulp.task('watch', [ 'build', 'browser-sync' ], function () {
	gulp.watch('./app/assets/less/*.less', [ 'less' ]);
	gulp.watch('./app/assets/js/*.js', [ 'js' ]);
	gulp.watch('./app/assets/images/**/*', [ 'images' ]);
	gulp.watch('./app/*.html').on('change', function (file) {
		console.log('refreshing ' + file.path);
		gulp.src( file.path )
			.pipe( gulp.dest( './build/' ) )
			.pipe( reload({stream:true}) );
	});
});