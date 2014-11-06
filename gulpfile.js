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


gulp.task('default', function() {
	console.log('yo, this does nothing')
});

gulp.task('less', function () {
	gulp.src('app/css/*.css')
	    .pipe( plumber() )
	    .pipe( less() )
	    .pipe( gulp.dest('build/css') )
	    .pipe( livereload(lrServer) );
});

gulp.task('html', function () {
	gulp.src( './app/html/**/*.html' )
	    .pipe( htmlhint() )
	    .pipe( htmlhint.reporter() )
	    .pipe( gulp.dest( './build' ) )
	    .pipe( livereload( lrServer ) );
});


gulp.task('fonts', function () {
	gulp.src('./app/fonts/**').pipe( gulp.dest('./build/fonts') )
	    .pipe( livereload(lrServer) );
});

gulp.task('images', function () {
	gulp.src('./app/images/**').pipe( gulp.dest('./build/images') )
	    .pipe( livereload(lrServer) );
});

gulp.task('js', function () {
	gulp.src('./app/js/*.js').pipe( gulp.dest('./build/js') )
	    .pipe( livereload(lrServer) );
});

gulp.task('build', [ 'less', 'fonts', 'images', 'html', 'js' ]);
gulp.task('server', httpserver);

gulp.task('watch', [ 'build' ], function () {
	httpserver();
	lrServer.listen(35729, function (err) {
		if (err) return console.log(err);

		gulp.watch('./app/css/**/*', [ 'less' ]);
		gulp.watch('./app/js/*.js', [ 'js' ]);
		gulp.watch('./app/images/**/*', [ 'images' ]);
		gulp.watch('./app/html/*/*').on('change', function (file) {
			var dest = file.path.split('/').slice(-2)[0];
			gulp.src( file.path ).pipe( gulp.dest( './build/' + dest ) )
			    .pipe( livereload( lrServer ) );
		});
	});
});
