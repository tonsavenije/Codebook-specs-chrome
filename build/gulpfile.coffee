gulp         = require 'gulp'
parameters   = require '../config/parameters.coffee'

concat       = require 'gulp-concat'
gutil        = require 'gulp-util'
sass         = require 'gulp-sass'
bowerFiles   = require 'gulp-main-bower-files'
uglify       = require 'gulp-uglify'


gulp.task 'sass', ->	
	gulp.src parameters.styles_main_file
	.pipe sass()
	.pipe gulp.dest parameters.web_path+'/css'
	.on 'error', gutil.log

gulp.task 'bower', ->
	gulp.src './bower.json'
	.pipe bowerFiles()
	.pipe concat parameters.bower_main_file
	.pipe gulp.dest parameters.web_path+'/js'
	.on 'error', gutil.log

gulp.task 'vendor', ->
    gulp.src parameters.vendor_path+'/**/*.js'
    .pipe concat parameters.vendor_main_file
    .pipe gulp.dest parameters.web_path+'/js'
    .on 'error', gutil.log
	
gulp.task 'minify',
	['vendor', 'bower'], ->
		gulp.src parameters.web_path+'/**/*.js'
		.pipe uglify outSourceMap: true
		.pipe gulp.dest parameters.web_path+'/js'
		.on 'error', gutil.log

gulp.task 'html', ->
	gulp.src parameters.app_path + '/**/*.html'
	.pipe gulp.dest parameters.web_path + '/'
	.on 'error', gutil.log

gulp.task 'js', ->
	gulp.src parameters.app_path + '/**/*.js'
	.pipe gulp.dest parameters.web_path + '/'
	.on 'error', gutil.log
	
gulp.task 'json', ->
	gulp.src parameters.app_path + '/**/*.json'
	.pipe gulp.dest parameters.web_path + '/'
	.on 'error', gutil.log

gulp.task 'assets', ->
	gulp.src parameters.assets_path + '/**/*'
	.pipe gulp.dest parameters.web_path + '/' + parameters.assets_path
	.on 'error', gutil.log
	
serve = require 'gulp-serve'

gulp.task 'watch', ['build'], -> # After all build tasks are done
		gulp.watch parameters.app_path + '/**/*.scss', ['sass'] # Manifest and references task is necessary if these files are versioned
		gulp.watch parameters.assets_path, ['assets']
		gulp.watch 'bower.json', ['vendors']

gulp.task 'serve', ['build'], serve parameters.web_path

gulp.task 'build', ['sass', 'html', 'json', 'assets', 'js']

gulp.task 'default', ->
	