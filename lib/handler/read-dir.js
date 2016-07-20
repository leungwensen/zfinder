'use strict';
/**
 * read-dir module
 * @module read-dir
 * @see module:index
 */
const fs = require('fs');
const lang = require('zero-lang');
const Handler = require('./base');
const wrapPathInfo = require('../common/wrap-path-info');

const name = 'read-dir';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',

  toRoute(options, rc) {
    const root = rc.root;

    return (req, res, next) => {
      if (req._handler === name) {
        fs.readdir(req._normalizedPathname, (err, files) => {
          if (err) return next(err);
          let pathInfoList = lang.map(files, (filename) => wrapPathInfo(root, req._normalizedPathname, filename));
          if (rc.dotfiles !== 'allow') {
            pathInfoList = lang.filter(pathInfoList, (pathInfo) => !pathInfo.isHidden);
          }
          return res._JSONRes(pathInfoList);
        });
      } else {
        next();
      }
    };
  }
});
