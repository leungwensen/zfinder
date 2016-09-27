'use strict';
/**
 * is-binary module
 * @module is-binary
 * @see module:index
 */
const getLanguageByFilename = require('./get-language-by-filename');

module.exports = filename => !!getLanguageByFilename(filename).isBinary;
