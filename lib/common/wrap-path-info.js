'use strict';
/**
 * wrap-path-info module
 * @module wrap-path-info
 * @see module:index
 */
const path = require('path');
const fs = require('fs');

const wrapPathInfoWithProps = require('./wrap-path-info-with-props');

module.exports = (root, pathname, filename) => { // $root/$relativePath/$filename
  const relativePath = path.relative(root, path.join(pathname, filename));
  const fullPath = path.join(root, relativePath);
  const stats = fs.statSync(fullPath);
  return wrapPathInfoWithProps(root, relativePath, fullPath, filename, stats);
};
