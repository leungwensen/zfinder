'use strict';
/**
 * wrap-path-summary module
 * @module wrap-path-summary
 * @see module:index
 */
const fs = require('fs');
const lang = require('zero-lang');
const extnames = [
  'markdown',
  'md',
];

module.exports = pathInfo => {
  const extname = pathInfo.extname;
  if (lang.contains(extnames, extname)) {
    pathInfo.content = fs.readFileSync(pathInfo.fullPath, {
      encoding: 'utf8'
    });
    if (extname === 'markdown' || extname === 'md') {
      const lines = pathInfo.content.split(/[\n\r]/);
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (line) {
          // first line(header) as summary
          pathInfo.summary = lang.trim(line.replace(/^#*/, ''));
          break;
        }
        i ++;
      }
    }
  }
  return pathInfo;
};
