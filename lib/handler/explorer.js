'use strict';
/**
 * explorer module
 * @module explorer
 * @see module:index
 */
const lang = require('zero-lang');
const Handler = require('./base');
const template = require('../template/explorer');

const name = 'explorer';
const DEFAULT_OPTIONS = {};

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute(options, rc) {
    options = lang.extend({}, DEFAULT_OPTIONS, options);
    return (req, res, next) => {
      if (req._isDirectory && !(req._handler && req._handler !== name)) {
        try {
          res._HTMLRes(template({
            pathInfo: req._pathInfo,
            rc,
          }));
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
