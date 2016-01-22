var cp = require('child_process');
var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('pre', function() {
  cp.execSync('npm run build');
});

gulp.task('js', ['pre'], function() {
  return gulp.src('./dist/bragi.js')
    .pipe(require('gulp-uglify')())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css', ['pre'], function(){
 return gulp.src('./dist/bragi.css')
   .pipe(require('gulp-minify-css')())
   .pipe(rename({extname: '.min.css'}))
   .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['js', 'css']);
