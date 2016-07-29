'use strict';
/**
 * text-editor module
 * @module text-editor
 * @see module:index
 */
const lang = require('zero-lang');
const fs = require('fs');
const path = require('path');
const escape = require('escape-html');
const Handler = require('./base');
const getLanguageByFilename = require('../common/get-language-by-filename');
const isBinary = require('../common/is-binary');
const template = require('../template/text-editor');
const wrapPathInfoWithProps = require('../common/wrap-path-info-with-props');

const name = 'text-editor';
const DEFAULT_OPTIONS = {
  maxFileSize: 1024000,
};

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute(options, rc) {
    const root = rc.root;
    options = lang.extend({}, DEFAULT_OPTIONS, options);

    return (req, res, next) => {
      /*
       * params might affect handler:
       * {
       *    _handler: 'dot-renderer',
       *    content: 'dot language',
       * }
       */
      const pathname = req._normalizedPathname;
      if (!req._raw && !req._isBinary && req._isFile && req._stats && req._stats.size < options.maxFileSize) {
        try {
          const fileInfo = wrapPathInfoWithProps(
            root,
            path.relative(root, pathname),
            pathname,
            path.basename(pathname),
            req._stats
          );
          const language = getLanguageByFilename(pathname);
          res._HTMLRes(template({
            title: fileInfo.basename,
            content: escape(fs.readFileSync(pathname, 'utf8')),
            rc,
            fileInfo,
            language,
          }));
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
