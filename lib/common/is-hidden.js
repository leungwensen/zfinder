'use strict';
/**
 * is-hidden module
 * @module is-hidden
 * @see module:index
 */

module.exports = (pathname) => (pathname.toString().charAt(0) === '.');
