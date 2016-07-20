'use strict';
/**
 * fix-path module
 * @module fix-path
 * @see module:index
 */

module.exports = (str) => (str || '').replace(/\\\\/g, '/');
