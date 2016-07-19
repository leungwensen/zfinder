const config = require('./config');
const gulp = require('gulp');
const gutil = require('gulp-util');
const jsdoc = require('gulp-jsdoc3');
const lang = require('zero-lang');
const path = require('path');
const plumber = require('gulp-plumber');

lang.each(config.jsdocDirs, (dir) => {
  const c = lang.extend({}, config.jsdocConfig, {
    opts: {
      destination: path.resolve(__dirname, `../doc/jsdoc/${dir}`)
    }
  });
  gulp.task(`jsdoc-${dir}`, () =>
      gulp.src(path.resolve(__dirname, `../${dir}/**/*.js`), {
        read: false
      })
        .pipe(plumber())
        .pipe(jsdoc(c))
        .on('error', (err) => {
          gutil.log(gutil.colors.red(err.message));
        })
  );
});

gulp.task('jsdoc', lang.map(config.jsdocDirs, (dir) => `jsdoc-${dir}`));
