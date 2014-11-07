var gulp       = require('gulp');
var less       = require('gulp-less');
var changed    = require('gulp-changed');
var livereload = require('gulp-livereload');
var plumber    = require('gulp-plumber');
var htmlhint   = require('gulp-htmlhint');
var connect    = require('connect');
var lr         = require('tiny-lr');
var lrServer   = lr();

function httpserver() {
	return connect().use( require('connect-livereload')() )
	                .use( connect.static('./build') )
	                .listen('4269');
}

gulp.task('base', function() {
	gulp.src(['./app/**/*', '!./app/assets/', '!./app/*.html'], { base: './app'})
	    .pipe( gulp.dest('./build') )
	    .pipe( livereload(lrServer) );
});

gulp.task('less', function () {
	gulp.src('app/assets/less/*.less')
	    .pipe( plumber() )
	    .pipe( less() )
	    .pipe( gulp.dest('build/assets/css') )
	    .pipe( livereload(lrServer) );
});

gulp.task('html', function () {
	gulp.src( './app/*.html' )
	    .pipe( htmlhint() )
	    .pipe( htmlhint.reporter() )
	    .pipe( gulp.dest( './build' ) )
	    .pipe( livereload( lrServer ) );
});

gulp.task('images', function () {
	gulp.src('./app/assets/images/**').pipe( gulp.dest('./build/assets/images') )
	    .pipe( livereload(lrServer) );
});

gulp.task('js', function () {
	gulp.src('./app/assets/js/**').pipe( gulp.dest('./build/assets/js') )
	    .pipe( livereload(lrServer) );
});

gulp.task('build', [ 'base', 'less', 'images', 'html', 'js' ]);

gulp.task('server', httpserver);

gulp.task('watch', [ 'build' ], function () {
	httpserver();
	lrServer.listen(35729, function (err) {
		if (err) return console.log(err);

		gulp.watch('./app/assets/css/**/*', [ 'less' ]);
		gulp.watch('./app/assets/js/*.js', [ 'js' ]);
		gulp.watch('./app/assets/images/**/*', [ 'images' ]);

		gulp.watch('./app/*.html').on('change', function (file) {
			console.log('refreshing ' + file.path);
			gulp.src( file.path )
			    .pipe( gulp.dest( './build/' ) )
			    .pipe( livereload( lrServer ) )
		});
	});
});
