'use strict';
/**
 * decode-uri module
 * @module decode-uri
 * @see module:index
 */

module.exports = str => decodeURIComponent(str || '').replace(/\+/g, ' ');
