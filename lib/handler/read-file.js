'use strict';
/**
 * read-file module
 * @module read-file
 * @see module:index
 */
const Handler = require('./base');
const wrapFileInfo = require('../common/wrap-file-info');

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
        try {
          res._JSONRes(wrapFileInfo(root, root, decodedPathname));
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
