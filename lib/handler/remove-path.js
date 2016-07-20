'use strict';
/**
 * remove-path module
 * @module remove-path
 * @see module:index
 */
const shelljs = require('shelljs');
const Handler = require('./base');

const name = 'remove-path';

module.exports = new Handler({
  method: 'delete',
  name,
  url: '*',

  toRoute() {
    return (req, res, next) => {
      if (req._handler === name) {
        try {
          shelljs.rm('-rf', req._normalizedPathname);
          res._JSONRes({
            success: true
          });
        } catch (e) {
          console.log(e);
          next(e);
        }
      } else {
        next();
      }
    };
  }
});
