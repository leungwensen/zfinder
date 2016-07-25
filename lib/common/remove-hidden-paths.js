'use strict';
/**
 * remove-hidden-paths module
 * @module remove-hidden-paths
 * @see module:index
 */
const lang = require('zero-lang');
const isHidden = require('./is-hidden');

module.exports = (paths) => lang.filter(paths, (pathname) => !isHidden(pathname));
