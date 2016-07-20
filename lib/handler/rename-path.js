'use strict';
/**
 * rename-path module
 * @module rename-path
 * @see module:index
 */
const fs = require('fs');
const path = require('path');
const httpErrors = require('http-errors');
const Handler = require('./base');
const wrapPathInfo = require('../common/wrap-path-info');
const decodeUri = require('../common/decode-uri');

const name = 'rename-path';

module.exports = new Handler({
  method: 'put',
  name,
  url: '*',

  toRoute(options, rc) {
    const root = rc.root;

    return (req, res, next) => {
      if (req._handler === name) {
        const decodedPathname = req._decodedPathname;
        if (decodedPathname.length <= 1) return next(httpErrors(400));

        const decodedNewPath = decodeUri(req._params.newPath);
        if (!decodedNewPath) return next();

        fs.rename(req._normalizedPathname, path.normalize(path.join(root, decodedNewPath)), (err) => {
          if (err) {
            return next(err);
          }
          res._JSONRes(wrapPathInfo(root, root, decodedNewPath));
        });
      } else {
        next();
      }
    };
  }
});
