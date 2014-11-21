var gulp       = require('gulp');
var less       = require('gulp-less');
// var changed    = require('gulp-changed');
var plumber    = require('gulp-plumber');
var htmlhint   = require('gulp-htmlhint');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

gulp.task('newjs', function() {
	var bundler = watchify(browserify('./app/assets/js/index.js', watchify.args))

	// Optionally, you can apply transforms
	// and other configuration options on the
	// bundler just as you would with browserify
	bundler.transform('brfs');

	bundler.on('update', rebundle);

	function rebundle() {
		return bundler.bundle()
		// log errors if they happen
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./build/assets/js/'))
		.pipe( reload({stream:true}));
	}

	return rebundle();
});

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
	return gulp.src('./app/assets/js/lib/**').pipe( gulp.dest('./build/assets/js/lib') )
		.pipe( reload({stream:true}));
});

gulp.task('build', [ 'base', 'less', 'images', 'html', 'js', 'newjs' ]);

gulp.task('watch', [ 'build', 'browser-sync' ], function () {
	gulp.watch('./app/assets/less/*.less', [ 'less' ]);
	gulp.watch('./app/assets/js/*.js', [ 'newjs' ]);
	gulp.watch('./app/assets/js/lib/*.js', [ 'js' ]);
	gulp.watch('./app/assets/images/**/*', [ 'images' ]);
	gulp.watch('./app/*.html').on('change', function (file) {
		console.log('refreshing ' + file.path);
		gulp.src( file.path )
			.pipe( gulp.dest( './build/' ) )
			.pipe( reload({stream:true}) );
	});
});
