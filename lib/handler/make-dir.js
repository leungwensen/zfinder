'use strict';
/**
 * make-dir module
 * @module make-dir
 * @see module:index
 */
const shelljs = require('shelljs');
const Handler = require('./base');
const wrapPathInfo = require('../common/wrap-path-info');

const name = 'make-dir';

module.exports = new Handler({
  method: 'post',
  name,
  url: '*',

  toRoute(options, rc) {
    const root = rc.root;

    return (req, res, next) => {
      if (req._handler === name) {
        try {
          shelljs.mkdir('-p', req._normalizedPathname);
          res._JSONRes(wrapPathInfo(root, root, req._decodedPathname));
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
