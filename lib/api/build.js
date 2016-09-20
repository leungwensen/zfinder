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
const isHidden = require('../common/is-hidden');
const log = require('./log');
const markdown2previewHtml = require('../common/markdown2preview-html');
const viz2svg = require('../common/viz2svg');
const plantuml2svg = require('../common/plantuml2svg');

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

function fixMarkdownLink(content) {
  return content.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, (match, p1, p2) => {
    p2 = lang.trim(p2);
    const extname = path.extname(p2);
    // link to a markdown file in current directory
    if (p2.charAt(0) === '.' && (extname === '.md' || extname === '.markdown')) {
      return `[${p1}](${path.dirname(p2)}/${path.basename(p2, extname)}.html)`;
    }
    return match;
  });
}

function processFile(filename, options) {
  const extname = path.extname(filename);
  const basename = path.basename(filename);
  try {
    if (extname === '.markdown' || extname === '.md') {
      generate(
        filename,
        '.html',
        markdown2previewHtml(fixMarkdownLink(fs.readFileSync(filename, 'utf8')), basename, options),
        options
      );
    }
    if (extname === '.gv' || extname === '.dot') {
      generate(
        filename,
        '.svg',
        viz2svg(fs.readFileSync(filename, 'utf8'), 'dot'),
        options
      );
    }
    if (extname === '.plantuml') {
      generate(
        filename,
        '.svg',
        plantuml2svg(fs.readFileSync(filename, 'utf8')),
        options
      );
    }
    if (extname === '.xmind') {
    }
  } catch (e) {
    log(`ERROR while processing file ${filename}: ${e}`);
  }
}

function buildDir(root, dirname, options) {
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
            buildDir(root, fullPath, options);
          }
        } else if (stats.isFile()) {
          processFile(fullPath, options);
        }
      });
    }
  })
}

module.exports = (root, rc) => {
  process.env.ZFINDER_DEBUG = rc.debug;
  const buildOpts = lang.merge({}, rc, rc.build);

  const stat = fs.statSync(root);
  if (stat.isFile()) {
    processFile(root, buildOpts);
  } else {
    if (buildOpts.gitignore) {
      buildOpts.ignoreGlobs = [];
      try {
        const gitignoreContent = fs.readFileSync(path.resolve(root, './.gitignore'), 'utf8');
        buildOpts.ignoreGlobs = lang.filter(gitignoreContent.split(/[\r|\n]/), (line) => !!line);
      } catch (e) {
        // log(e);
      }
    }
    buildDir(root, root, buildOpts);
  }
};
