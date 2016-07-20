'use strict';
/**
 * read-file module
 * @module read-file
 * @see module:index
 */
const httpErrors = require('http-errors');
const Handler = require('./base');
const wrapFileInfo = require('../common/wrap-file-info');
const isHidden = require('../common/is-hidden');

const name = 'read-file';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',

  toRoute(options, rc) {
    const root = rc.root;

    return (req, res, next) => {
      if (req._handler === name) {
        const decodedPathname = req._decodedPathname;
        if (rc.dotfiles !== 'allow' && isHidden(decodedPathname)) {
          next(httpErrors(400));
        } else {
          try {
            res._JSONRes(wrapFileInfo(root, root, decodedPathname));
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
