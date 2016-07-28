'use strict';
/**
 * language-by-extname module
 * @module language-by-extname
 * @see module:index
 */
const getExtname = require('./get-extname');
const getLanguageByExtname = require('./get-language-by-extname');

module.exports = (filename) => getLanguageByExtname(getExtname(filename));
