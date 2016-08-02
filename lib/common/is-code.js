'use strict';
/**
 * is-binary module
 * @module is-binary
 * @see module:index
 */
const getLanguageByFilename = require('./get-language-by-filename');

module.exports = (filename) => {
  const language = getLanguageByFilename(filename);
  return !language.isBinary && language.name !== 'Text';
};
