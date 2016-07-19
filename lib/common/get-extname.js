'use strict';
/**
 * get-extname module
 * @module get-extname
 * @see module:index
 */
const path = require('path');
const lang = require('zero-lang');

module.exports = (filename) => lang.lc(path.extname(filename).substr(1));
