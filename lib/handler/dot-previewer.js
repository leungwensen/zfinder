'use strict';
/**
 * dot-previewer module
 * @module dot-previewer
 * @see module:index
 */
const fs = require('fs');
const Handler = require('./base');
const viz2svg = require('../common/viz2svg');

const name = 'dot-previewer';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute() {
    return (req, res, next) => {
      /*
       * params might affect handler:
       * {
       *    raw: anything
       * }
       */
      const pathname = req._normalizedPathname;
      if (req._isFile && (req._extname === '.dot' || req._extname === '.gv') && !req._raw) {
        try {
          res._sendRes(viz2svg(fs.readFileSync(pathname, 'utf8'), 'dot'), 'image/svg+xml');
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
