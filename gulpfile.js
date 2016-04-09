var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('js', function() {
  return gulp.src('bundle/bragi.js')
    .pipe(gulp.dest('build/'))
    .pipe(require('gulp-uglify')())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('build/'));
});

gulp.task('css', function(){
  return gulp.src('bundle/bragi.css')
    .pipe(gulp.dest('build/'))
    .pipe(require('gulp-minify-css')())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('build/'));
});

gulp.task('default', ['js', 'css']);
