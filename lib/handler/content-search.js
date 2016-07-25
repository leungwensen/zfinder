'use strict';
/**
 * content-search module
 * @module content-search
 * @see module:index
 */
const fs = require('fs');
const httpErrors = require('http-errors');
const isBinaryPath = require('is-binary-path');
const lang = require('zero-lang');
const path = require('path');
const Handler = require('./base');
const removeHiddenPaths = require('../common/remove-hidden-paths');
const wrapPathInfoWithProps = require('../common/wrap-path-info-with-props');

const name = 'content-search';
const DEFAULT_OPTIONS = {
  maxFileSize: 1024000,
  maxFilesCount: 10,
  maxLineLen: 200,
  maxLinesCount: 3,
  ignores: [
    '.(class|swp|swo)$',
    'node_modules',
  ],
};

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute(options, rc) {
    const root = rc.root;
    options = lang.extend({}, DEFAULT_OPTIONS, options);
    const ignores = lang.map(options.ignores, (i) => new RegExp(i, 'i'));

    function walk(pathname, query, queryRegExp, result, resultCounter) {
      if (resultCounter >= options.maxFilesCount) return;
      let stat;
      try {
        stat = fs.statSync(pathname);
      } catch (e) {
        // because there might be links
      }
      if (!stat) return;

      if (stat.isDirectory()) {
        let files = fs.readdirSync(pathname);
        if (rc.dotfiles !== 'allow') {
          files = removeHiddenPaths(files);
        }
        lang.each(files, (filename) => {
          walk(path.join(pathname, filename), query, queryRegExp, result, resultCounter);
        });
      } else if (stat.isFile()) {
        if (isBinaryPath(pathname) || stat.size > options.maxFileSize) return;
        if (lang.some(ignores, (ignore) => ignore.test(pathname))) return;

        const str = fs.readFileSync(pathname, 'utf8');
        const lines = [];
        let linesCounter = 0;
        lang.some(str.split('\n'), (line, i) => {
          if (queryRegExp.test(line)) {
            linesCounter++;
            lines.push([i + 1, line]);
          }
          if (linesCounter === options.maxLinesCount) return true;
          return false;
        });
        if (lines.length) {
          resultCounter++;
          const fileInfo = wrapPathInfoWithProps(
            root,
            path.relative(root, pathname),
            pathname,
            path.basename(pathname),
            stat
          );
          fileInfo.matchedLines = lang.map(lines, (l) => {
            const lineNum = l[0];
            let lineStr = l[1];
            // if line is too long or is html string, reduce it
            if (lineStr.length > options.maxLineLen || /<\w+/.test(lineStr)) lineStr = `...${query}...`;
            lineStr = lang.trim(lineStr.replace(queryRegExp, '<span class="highlight">$1</span>'));
            return [lineNum, lineStr];
          });
          result.push(fileInfo);
        }
      }
    }

    return (req, res, next) => {
      /*
       * params required:
       * {
       *   _handler: 'content-search',
       *   q: 'query',
       * }
       */
      if (req._handler === name) {
        const query = req._params.q;
        if (!query) {
          next(httpErrors(400));
        } else {
          // escape regexp characters
          const queryRegExp = new RegExp(`(${query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')})`, 'i');
          const result = [];
          walk(req._normalizedPathname, query, queryRegExp, result, 0);
          res._JSONRes({
            files: result
          });
        }
      } else {
        next();
      }
    };
  }
});
