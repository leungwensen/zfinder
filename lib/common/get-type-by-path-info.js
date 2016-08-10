'use strict';
/**
 * icon-by-path-info module
 * @module icon-by-path-info
 * @see module:index
 */
const getLanguageByFilename = require('./get-language-by-filename');

module.exports = (pathInfo) => {
  if (pathInfo.isDirectory) return 'directory';
  const language = getLanguageByFilename(pathInfo.basename);
  if (language) return language.key;
  return 'unknown'
};
