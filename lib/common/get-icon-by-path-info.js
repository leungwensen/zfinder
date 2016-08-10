'use strict';
/**
 * icon-by-path-info module
 * @module icon-by-path-info
 * @see module:index
 */
const iconByLanguage = require('../data/icon-by-language.json');
const getLanguageByFilename = require('./get-language-by-filename');

module.exports = (pathInfo) => {
  // with type and extname, etc.
  const extname = pathInfo.extname;
  const type = pathInfo.type;
  const language = getLanguageByFilename(pathInfo.basename);

  if (iconByLanguage[extname]) return iconByLanguage[extname];
  if (iconByLanguage[type]) return iconByLanguage[type];
  if (pathInfo.isHidden) return 'hidden';
  if (language && language.isBinary) return 'binary';
  return 'unknown';
};
