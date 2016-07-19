'use strict';
/**
 * wrap-file-info module
 * @module wrap-file-info
 * @see module:index
 */
const fs = require('fs');
const wrapPathInfo = require('./wrap-path-info');

module.exports = (root, pathname, filename) => {
  const pathInfo = wrapPathInfo(root, pathname, filename);
  pathInfo.content = fs.readFileSync(pathInfo.fullPath, {
    encoding: 'utf8'
  });
  return pathInfo;
};
