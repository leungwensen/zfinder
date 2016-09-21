'use strict';
/**
 * read-dir module
 * @module read-dir
 * @see module:index
 */
const fs = require('fs');
const lang = require('zero-lang');
const Handler = require('./base');
const getPathSummary = require('../common/get-path-summary');
const wrapPathInfo = require('../common/wrap-path-info');

const name = 'read-dir';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',

  toRoute(options, rc) {
    const root = rc.root;

    return (req, res, next) => {
      const withSummary = req._params.summary;
      if (req._handler === name) {
        fs.readdir(req._normalizedPathname, (err, files) => {
          if (err) {
            next(err);
          } else {
            let pathInfoList = lang.map(files, filename => wrapPathInfo(root, req._normalizedPathname, filename));
            if (!req._allowDotfiles) {
              pathInfoList = lang.filter(pathInfoList, pathInfo => !pathInfo.isHidden);
            }
            if (withSummary) {
              pathInfoList = lang.map(pathInfoList, pathInfo => getPathSummary(pathInfo));
            }
            res._JSONRes(pathInfoList);
          }
        });
      } else {
        next();
      }
    };
  }
});
