var cp = require('child_process');
var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('bundle', function() {
  cp.execSync('npm run bundle');
});

gulp.task('js', ['bundle'], function() {
  return gulp.src('./dist/bragi.js')
    .pipe(require('gulp-uglify')())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css', ['bundle'], function(){
 return gulp.src('./dist/bragi.css')
   .pipe(require('gulp-minify-css')())
   .pipe(rename({extname: '.min.css'}))
   .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['js', 'css']);
