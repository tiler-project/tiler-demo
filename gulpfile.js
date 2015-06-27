var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require ('browserify');
var reactify = require ('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var eventStream = require('event-stream');
var gutil = require ('gulp-util');

var paths = {
  components: 'components/**/*.jsx',
  dashboards: 'dashboards/**/*.jsx',
  styles: 'node_modules/normalize.css/normalize.css',
  fonts: 'node_modules/font-awesome/fonts/*',
  scriptsBuild: 'src/main/resources/static/scripts/dashboards/',
  stylesBuild: 'src/main/resources/static/styles/',
  fontsBuild: 'src/main/resources/static/fonts/'
};

gulp.task('clean', function(done) {
  del([paths.scriptsBuild, paths.stylesBuild, paths.fontsBuild], done);
});

gulp.task('scripts', function(done) {
  globby(paths.dashboards, function(err, files) {
    if (err) {
      done(err);
      return;
    }

    var tasks = files.map(function(filename) {
      return browserify(filename, {
          debug: true,
          transform: [
            [reactify, {harmony: true}]
          ]
        })
        .bundle()
        .pipe(source(filename.replace(/\.jsx$/, '.js')))
        .pipe(rename({dirname: ''}))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scriptsBuild));
    });
    eventStream.merge(tasks)
      .on('end', done);
  })});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(rename({basename: 'dashboard', extname: '.css'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.stylesBuild));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.fontsBuild));
});

gulp.task('watch', function() {
  gulp.watch([paths.components, paths.dashboards], ['scripts']);
  gulp.watch([paths.styles], ['styles']);
});

gulp.task('build', function(done) {
  runSequence(
    'clean',
    ['scripts', 'styles', 'fonts'],
    done);
});

gulp.task('default', ['watch', 'build']);
