'use strict';
/**
 * plantuml-previewer module
 * @module plantuml-previewer
 * @see module:index
 */
const fs = require('fs');
const Handler = require('./base');
const plantuml2svg = require('../common/plantuml2svg');

const name = 'plantuml-previewer';

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
      if (req._isFile && req._extname === '.plantuml' && !req._raw) {
        try {
          res._sendRes(plantuml2svg(fs.readFileSync(pathname, 'utf8')), 'image/svg+xml');
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
