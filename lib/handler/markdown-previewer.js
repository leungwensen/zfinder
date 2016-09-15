'use strict';
/**
 * markdown-previewer module
 * @module markdown-previewer
 * @see module:index
 */
const fs = require('fs');
const path = require('path');
const Handler = require('./base');
const markdown2previewHtml = require('../common/markdown2preview-html');

const name = 'markdown-previewer';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute(options, rc) {
    return (req, res, next) => {
      /*
       * params might affect handler:
       * {
       *    raw: anything
       * }
       */
      const pathname = req._normalizedPathname;
      if (req._isFile && (req._extname === '.md' || req._extname === '.markdown') && !req._raw) {
        try {
          res._HTMLRes(markdown2previewHtml(fs.readFileSync(pathname, 'utf8'), path.basename(pathname), rc));
        } catch (e) {
          next(e);
        }
      } else {
        next();
      }
    };
  }
});
