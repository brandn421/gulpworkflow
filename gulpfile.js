var 	gulp = require('gulp'),
		gutil = require('gulp-util'),
		coffee = require('gulp-coffee'),
		browserify = require('gulp-browserify'),
		compass = require('gulp-compass'),
		connect = require('gulp-connect'),
		concat = require('gulp-concat');

var 	env,
		coffeeSources,
		jsSources,
		sassSources,
		htmlSources,
		jsonSources,
		outputDir,
		sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = ['components/scripts/*.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSrouces = [outputDir + '*.json'];

gulp.task('html', function() {
	gulp.src('htmlSources')
		.pipe(connect.reload())
}); //gulp-html

gulp.task('json', function() {
	gulp.src('jsonSources')
		.pipe(connect.reload())
}); //gulp-json

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
}); //gulp-coffee

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
}); //gulp-js

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + 'images',
			require: 'susy',
			style: 'expanded'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
}); //gulp-compass

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('htmlSources', ['html']);
	gulp.watch('Sources', ['json']);
}); //gulp-watch

gulp.task('connect', function() {
	connect.server({
		root: 'outputDir',
		livereload: true
	});
}); //gulp-connect

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);



