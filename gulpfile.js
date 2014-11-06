var gulp       = require('gulp');
var less       = require('gulp-less');
var changed    = require('gulp-changed');
var livereload = require('gulp-livereload');
var plumber    = require('gulp-plumber');
var htmlhint   = require('gulp-htmlhint');
var connect    = require('connect');
var lr         = require('tiny-lr');
var lrServer   = lr();
var deploy     = require('gulp-gh-pages');

function httpserver() {
	return connect().use( require('connect-livereload')() )
	                .use( connect.static('./build') )
	                .listen('4269');
}

gulp.task('deploy', function () {
	var options = {};
	return gulp.src('./build/**/*')
	           .pipe(deploy(options));
});


gulp.task('default', function() {
	console.log('yo, this does nothing')
});

gulp.task('less', function () {
	gulp.src('app/assets/less/*.less')
	    .pipe( plumber() )
	    .pipe( less() )
	    .pipe( gulp.dest('build/assets/css') )
	    .pipe( livereload(lrServer) );
});

gulp.task('html', function () {
	gulp.src( './app/*.html' ) // TODO fix for elsewhere experiments tools wc14 tmp 
	    .pipe( htmlhint() )
	    .pipe( htmlhint.reporter() )
	    .pipe( gulp.dest( './build' ) )
	    .pipe( livereload( lrServer ) );
});

gulp.task('wc14', function () {
	gulp.src('./app/wc14/**').pipe( gulp.dest('./build/wc14') )
	    .pipe( livereload(lrServer) );
});

gulp.task('tools', function () {
	gulp.src('./app/tools/**').pipe( gulp.dest('./build/tools') )
	    .pipe( livereload(lrServer) );
});

gulp.task('elsewhere', function () {
	gulp.src('./app/elsewhere/**').pipe( gulp.dest('./build/elsewhere') )
	    .pipe( livereload(lrServer) );
});

gulp.task('experiments', function () {
	gulp.src('./app/experiments/**').pipe( gulp.dest('./build/experiments') )
	    .pipe( livereload(lrServer) );
});

gulp.task('tmp', function () {
	gulp.src('./app/tmp/**').pipe( gulp.dest('./build/tmp') )
	    .pipe( livereload(lrServer) );
});

gulp.task('subdirs', [ 'wc14', 'tools', 'elsewhere', 'experiments', 'tmp' ]);

// gulp.task('fonts', function () {
// 	gulp.src('./app/fonts/**').pipe( gulp.dest('./build/fonts') )
// 	    .pipe( livereload(lrServer) );
// });

gulp.task('basics', function () {
	gulp.src([ 'app/CNAME', 'app/favicon.ico', 'app/_config.yml', 'app/_layouts/**', 'app/_posts/**' ], { base: 'app/' } )
	    .pipe( gulp.dest('./build/') )
	    .pipe( livereload(lrServer) );
});


gulp.task('images', function () {
	gulp.src('./app/assets/images/**').pipe( gulp.dest('./build/assets/images') )
	    .pipe( livereload(lrServer) );
});

gulp.task('js', function () {
	gulp.src('./app/assets/js/**').pipe( gulp.dest('./build/assets/js') )
	    .pipe( livereload(lrServer) );
});

gulp.task('build', [ 'basics', 'less', /*'fonts',*/ 'images', 'html', 'js', 'subdirs' ]);
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
