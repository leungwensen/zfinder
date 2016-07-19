'use strict';
/**
 * serve-index module
 * @module serve-index
 * @see module:index
 */
const fs = require('fs');
const path = require('path');
const lang = require('zero-lang');
const Handler = require('./base');

const DEFAULT_SUFFIXES = [
  '.html',
  '/index.html',
];

module.exports = new Handler({
  name: 'serve-index',
  method: 'get',

  toRoute(options, rc) {
    options.suffixes = options.suffixes || DEFAULT_SUFFIXES;

    return (req, res, next) => {
      const dir = req._pathname;
      const cwd = path.normalize(path.join(rc.root, dir))
        .replace(/\/+$/, '')
        .replace(/\\+$/, '');

      let matched = false;
      lang.some(options.suffixes, (suffix) => {
        try {
          if (fs.statSync(path.resolve(cwd + suffix))) {
            // TODO fix windows paths
            res.redirect(path.resolve(dir + suffix));
            matched = true;
          }
          return true;
        } catch (e) {
          return false;
        }
      });
      if (!matched) {
        next();
      }
    };
  }
});
