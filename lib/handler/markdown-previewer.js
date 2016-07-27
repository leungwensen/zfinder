'use strict';
/**
 * markdown-previewer module
 * @module markdown-previewer
 * @see module:index
 */
const fs = require('fs');
const path = require('path');
const Handler = require('./base');
const markdown2html = require('../common/markdown2html');
const getTitleFromHtml = require('../common/get-title-from-html');
const template = require('../template/markdown-previewer');

const name = 'dot-previewer';

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
          const body = markdown2html(fs.readFileSync(pathname, 'utf8'));
          const title = getTitleFromHtml(body, path.basename(pathname));
          res._HTMLRes(template({
            body,
            rc,
            title,
          }));
        } catch (e) {
          next(e);
        }
      } else {
        next();
      }
    };
  }
});
