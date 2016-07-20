'use strict';
/**
 * is-hidden module
 * @module is-hidden
 * @see module:index
 */
const path = require('path');

module.exports = (pathname) => path.basename(pathname || '').toString().charAt(0) === '.';
