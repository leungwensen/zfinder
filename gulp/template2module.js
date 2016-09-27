const fs = require('fs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const lang = require('zero-lang');
const path = require('path');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const through = require('through2');
const tpl2mod = require('template2module');
const underscoreEngine = tpl2mod.engines.underscore;
const config = require('./config');

underscoreEngine.outerScopeVars.JSON = true;

const REGEXP = {
  importTag: /<import\s+src="\S*"><\/import>/g,
  svgSpriteTag: /<svg-sprite\/>/,
  srcPath: /src="(\S*)"/,
};

const svgSprite = fs.readFileSync(path.resolve(__dirname, '../dist/zfinder/svg-symbols.svg'), 'utf8');

function parsingSvgSprite(content) {
  return content.replace(REGEXP.svgSpriteTag, svgSprite);
}

function importing(content, resourcePath) {
  const match = content.match(REGEXP.importTag);
  if (match) {
    lang.each(match, (m) => {
      const sourcePath = m.match(REGEXP.srcPath)[1];
      const absoluteSourcePath = path.resolve(path.dirname(resourcePath), sourcePath);
      const sourceOriginContent = fs.readFileSync(absoluteSourcePath, 'utf8');
      const sourceDistContent = importing(sourceOriginContent, absoluteSourcePath);
      content = content.replace(m, sourceDistContent);
    });
  }
  return content;
}

function renderTemplates() {
  return through.obj(function render(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('template2module', 'Streaming not supported'));
    }

    try {
      gutil.log(file.path);
      // @TODO add svg sprite file as needed, instead of putting the whole evil-icons svg file
      const templateContent = parsingSvgSprite(
        importing(file.contents.toString('utf8'), file.path)
      );
      const content = underscoreEngine.render(templateContent, file.path, 'commonjs');
      file.contents = new Buffer(`/* eslint-disable */ ${content}`);
    } catch (err) {
      this.emit('error', new gutil.PluginError('template2module', err.toString()));
    }

    this.push(file);
    return cb();
  });
}

lang.each(config.templateDirs, (dir) => {
  gulp.task(`template2module-${dir}`, () =>
    gulp.src(path.resolve(__dirname, `../${dir}/**/*.html`))
      .pipe(plumber())
      .pipe(renderTemplates())
      .on('error', (err) => {
        gutil.log(gutil.colors.red(err.message));
      })
      .pipe(rename((pathname) => {
        pathname.extname = '.js';
      }))
      .pipe(gulp.dest(path.resolve(__dirname, `../${dir}/`))));
});

gulp.task('template2module', lang.map(config.templateDirs, dir => `template2module-${dir}`));
