'use strict';
/**
 * write-file module
 * @module write-file
 * @see module:index
 */
const fs = require('fs');
const shelljs = require('shelljs');
const httpErrors = require('http-errors');
const Handler = require('./base');
const wrapPathInfo = require('../common/wrap-path-info');
const isHidden = require('../common/is-hidden');

const name = 'write-file';

module.exports = new Handler({
  method: 'put', // create or update
  name,
  url: '*',

  toRoute(options, rc) {
    const root = rc.root;

    return (req, res, next) => {
      if (req._handler === name) {
        const normalizedPathname = req._normalizedPathname;
        if (rc.dotfiles !== 'allow' && isHidden(normalizedPathname)) {
          next(httpErrors(400));
        } else {
          try {
            const pathWithOutFilename = normalizedPathname.replace(/\/[^\/]+$/, '');
            shelljs.mkdir('-p', pathWithOutFilename);
            const content = req._params.content || '';
            fs.writeFile(normalizedPathname, content, (err) => {
              if (err) {
                next(err);
              } else {
                res._JSONRes(wrapPathInfo(root, root, req._decodedPathname));
              }
            });
          } catch (err) {
            next(err);
          }
        }
      } else {
        next();
      }
    };
  }
});
