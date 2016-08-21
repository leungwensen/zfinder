'use strict';
/**
 * wrap-path-info-with-props module
 * @module wrap-path-info-with-props
 * @see module:index
 */
const lang = require('zero-lang');
const getExtname = require('./get-extname');
const getType = require('./get-type-by-path-info');
const getIcon = require('./get-icon-by-path-info');
const isHidden = require('./is-hidden');
const isCode = require('./is-code');
const isBinary = require('./is-binary');

module.exports = (root, relativePath, fullPath, filename, stats) => {
  const info = lang.extend({}, stats, {
    basename: filename,
    extname: getExtname(filename),
    fullPath,
    isBinary: isBinary(filename),
    isCode: isCode(filename),
    isDirectory: stats.isDirectory(),
    isHidden: isHidden(filename),
    relativePath,
    root,
  });
  console.log();
  info.type = getType(info);
  info.icon = getIcon(info);
  info.previewLink = `/${relativePath}${info.isDirectory ? '/' : ''}`;
  return info;
};
