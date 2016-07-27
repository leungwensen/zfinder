'use strict';
/**
 * dot-previewer module
 * @module dot-previewer
 * @see module:index
 */
const fs = require('fs');
// const httpErrors = require('http-errors');
const Handler = require('./base');
const viz = require('viz.js');

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
      if (req._isFile && req._extname === '.dot' && !req._raw) {
        try {
          const content = fs.readFileSync(pathname, 'utf8');
          const svg = viz(content, {
            format: 'svg',
            engine: 'dot',
          });
          res._sendRes(svg, 'image/svg+xml');
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
