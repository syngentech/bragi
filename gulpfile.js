var cp = require('child_process');
var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('pre', function() {
  cp.execSync('npm run build');
});

gulp.task('js', ['pre'], function() {
  return gulp.src('./build/js/bragi.js')
    .pipe(gulp.dest('./dist/js/'))
    .pipe(require('gulp-uglify')())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('css', ['pre'], function(){
 return gulp.src('./build/css/bragi.css')
   .pipe(gulp.dest('./dist/css/'))
   .pipe(require('gulp-minify-css')())
   .pipe(rename({extname: '.min.css'}))
   .pipe(gulp.dest('./dist/css/'));
});

gulp.task('default', ['js', 'css']);
