'use strict';
/**
 * mkdir module
 * @module mkdir
 * @see module:index
 */

const shelljs = require('shelljs');
const Handler = require('./base');
const wrapPathInfo = require('../common/wrap-path-info');

const name = 'mkdir';

module.exports = new Handler({
  method: 'post',
  name,
  url: '*',

  toRoute(options, rc) {
    const root = rc.root;

    return (req, res, next) => {
      if (req._handler === name) {
        shelljs.mkdir('-p', req._normalizedPathname);
        res._JSONRes(wrapPathInfo(root, root, req._decodedPathname));
      } else {
        next();
      }
    }
  }
});
