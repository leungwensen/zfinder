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
        const normalizedPathname = req._normalizedPathname;
        if (decodedPathname.length <= 1 || normalizedPathname === root) {
          // DO NOT allow renaming root
          next(httpErrors(400));
        } else {
          const decodedNewPath = decodeUri(req._params.newPath);
          if (!decodedNewPath) {
            // new path invalid
            next();
          } else {
            fs.rename(normalizedPathname, path.normalize(path.join(root, decodedNewPath)), (err) => {
              if (err) {
                next(err);
              } else {
                res._JSONRes(wrapPathInfo(root, root, decodedNewPath));
              }
            });
          }
        }
      } else {
        next();
      }
    };
  }
});
