// get gulp in here
var gulp = require('gulp');


// load in our modules
var jshint = require('gulp-jshint'); // lint javascript!
var uglify = require('gulp-uglify'); // uglify!
var concat = require('gulp-concat'); // concatenate files!
var sass = require('gulp-sass'); // compile sass!
var rename = require('gulp-rename'); // rename files
var serve = require('gulp-serve'); // serve stuff!
var autoprefixer = require('gulp-autoprefixer'); // prefix css
var gutil = require('gulp-util'); // logging, etc.
var dedupe = require('gulp-dedupe'); // de-duplicate css
var cleancss = require('gulp-clean-css'); // clean resulting css

// lint task
gulp.task('lint', function() {
	return gulp.src('src/js/*.js')
				 .pipe(jshint())
				 .pipe(jshint.reporter('default'));
});

// compile scss
gulp.task('scss', function() {
	return gulp.src('src/scss/main.scss')
				.pipe(sass())
				.on('error', gutil.log)
				.pipe(autoprefixer())
				.on('error', gutil.log)
				.pipe(rename('index.css'))
				.pipe(gulp.dest('.'))
				.pipe(dedupe())
				.pipe(cleancss())
				.pipe(rename('index.min.css'))
				.pipe(gulp.dest('.'));
});

// compile js
gulp.task('scripts', function() {
	return gulp.src('src/js/*.js')
				.pipe(concat('index.js'))
				.on('error', gutil.log)
				.pipe(gulp.dest('.'))
				.pipe(rename('index.min.js'))
				.pipe(uglify())
				.on('error', gutil.log)
				.pipe(gulp.dest('.'));
});

// watcher task
gulp.task('watch', function() {
	gulp.watch('src/scss/*', ['scss']);
	gulp.watch('src/js/*', ['lint', 'scripts']);
});

// serve files
gulp.task('serve', serve(['.']));

gulp.task('default', [
	'lint',
	'scss',
	'scripts',
	'watch',
	'serve',
]);
