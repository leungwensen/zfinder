'use strict';
/**
 * log module
 * @module api/log
 * @see module:index
 */
module.exports = function () {
  const debug = process.env.ZFINDER_DEBUG;
  if (debug && debug.toString() === 'true') {
    console.log.apply(console, arguments);
  }
};
