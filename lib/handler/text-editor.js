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
const template = require('../template/text-editor');

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
       *    _raw: true,
       * }
       */
      const pathname = req._normalizedPathname;
      const stats = req._stats;
      if (!req._raw && !req._isBinary && req._isFile && stats && stats.size < options.maxFileSize) {
        try {
          const fileInfo = req._pathInfo;
          res._HTMLRes(template({
            content: escape(fs.readFileSync(pathname, 'utf8')),
            fileInfo,
            language: req._fileLanguage,
            rc,
            title: fileInfo.basename,
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
