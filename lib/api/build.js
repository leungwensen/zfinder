'use strict';
/**
 * build module
 * @module build
 * @see module:index
 */
const fs = require('fs');
const path = require('path');
const lang = require('zero-lang');
const minimatch = require('minimatch');
const log = require('./log');
const markdown2previewHtml = require('../common/markdown2preview-html');
const isHidden = require('../common/is-hidden');

function generate(originFilename, targetExtname, content, options) {
  log(`------>processing ${originFilename}`);
  const dirname = path.dirname(originFilename);
  const basename = path.basename(originFilename);
  const extname = path.extname(originFilename);
  const basenameWithoutExtname = path.basename(originFilename, extname);
  const targetBasename = lang.hasKey(options.basenameMap, basename) ?
    options.basenameMap[basename] : `${basenameWithoutExtname}${targetExtname}`;
  const targetFilename = path.join(dirname, targetBasename);
  fs.writeFile(targetFilename, content, (err) => {
    if (err) {
      log(err);
    }
    log(`------>target file generated: ${targetFilename}`);
  });
}

function processFile(filename, options) {
  const extname = path.extname(filename);
  const basename = path.basename(filename);
  if (extname === '.markdown' || extname === '.md') {
    generate(
      filename,
      '.html',
      markdown2previewHtml(fs.readFileSync(filename, 'utf8'), basename, options),
      options
    );
  }
  if (extname === '.gv' || extname === '.dot') {
  }
  if (extname === '.plantuml') {
  }
  if (extname === '.xmind') {
  }
}

function build(root, dirname, options) {
  if (isHidden(dirname)) return;

  //log(`processing ${dirname}`);
  const ignoreGlobs = options.ignoreGlobs;

  fs.readdir(dirname, (err, files) => {
    let list = [];
    if (err) {
      log(err);
    } else {
      if (ignoreGlobs.length) {
        lang.each(files, (filename) => {
          if (!lang.some(ignoreGlobs, (glob) => minimatch(glob, path.relative(root, path.join(dirname, filename))))) {
            list.push(filename);
          }
        });
      } else {
        list = files;
      }
      lang.each(list, (pathname) => {
        const fullPath = path.join(dirname, pathname);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          if (options.recursive) {
            build(root, fullPath, options);
          }
        } else if (stats.isFile()) {
          processFile(fullPath, options);
        }
      });
    }
  })
}

module.exports = (rc) => {
  process.env.ZFINDER_DEBUG = rc.debug;

  const root = rc.root;
  const buildOpts = lang.merge({}, rc, rc.build);
  if (buildOpts.gitignore) {
    buildOpts.ignoreGlobs = [];
    try {
      const gitignoreContent = fs.readFileSync(path.resolve(root, './.gitignore'), 'utf8');
      buildOpts.ignoreGlobs = lang.filter(gitignoreContent.split(/[\r|\n]/), (line) => !!line);
    } catch (e) {
      log(e);
    }
  }
  build(root, root, buildOpts);
};
