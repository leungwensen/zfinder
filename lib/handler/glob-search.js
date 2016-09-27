'use strict';
/**
 * glob-search module
 * @module glob-search
 * @see module:index
 */
const fs = require('fs');
const httpErrors = require('http-errors');
const lang = require('zero-lang');
const minimatch = require('minimatch');
const path = require('path');
const Handler = require('./base');
const removeHiddenPaths = require('../common/remove-hidden-paths');
const wrapPathInfoWithProps = require('../common/wrap-path-info-with-props');

const name = 'glob-search';
const DEFAULT_OPTIONS = {
  maxPathsCount: 10,
  ignores: [
    'node_modules',
  ]
};

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute(options, rc) {
    const root = rc.root;
    options = lang.extend({}, DEFAULT_OPTIONS, options);
    const ignores = lang.map(options.ignores, ignore => new RegExp(ignore, 'i'));

    function walk(pathname, cwd, glob, result, resultCounter, allowDotfiles) {
      if (resultCounter >= options.maxPathsCount) {
        return;
      }
      if (lang.some(ignores, ignore => ignore.test(pathname))) {
        return;
      }
      let stat;
      try {
        stat = fs.statSync(pathname);
      } catch (e) {
        // because there might be links
      }
      if (!stat) {
        return;
      }

      if (minimatch(pathname.replace(cwd, ''), glob)) {
        result.push(
          wrapPathInfoWithProps(root, path.relative(root, pathname), pathname, path.basename(pathname), stat)
        );
        resultCounter++;
      }

      if (stat.isDirectory()) {
        let files = fs.readdirSync(pathname);
        if (!allowDotfiles) files = removeHiddenPaths(files);
        lang.each(files, (filename) => {
          walk(path.join(pathname, filename), cwd, glob, result, resultCounter, allowDotfiles);
        });
      }
    }

    return (req, res, next) => {
      /*
       * params required:
       * {
       *   _handler: 'glob-search',
       *   q: 'query',
       * }
       */
      if (req._handler === name) {
        const query = req._params.q;
        if (!query) {
          next(httpErrors(400));
        } else {
          const normalizedPathname = req._normalizedPathname;
          const result = [];
          walk(normalizedPathname, normalizedPathname, query, result, 0, req._allowDotfiles);
          res._JSONRes({
            paths: result
          });
        }
      } else {
        next();
      }
    };
  }
});
