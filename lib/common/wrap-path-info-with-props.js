'use strict';
/**
 * wrap-path-info-with-props module
 * @module wrap-path-info-with-props
 * @see module:index
 */
const lang = require('zero-lang');
const getExtname = require('./get-extname');
const isHidden = require('./is-hidden');

module.exports = (root, relativePath, fullPath, filename, stats) => lang.extend({}, stats, {
  extname: getExtname(filename),
  fullPath,
  isDirectory: stats.isDirectory(),
  isHidden: isHidden(filename),
  pathname: filename,
  relativePath,
  root,
});
