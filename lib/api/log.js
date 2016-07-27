'use strict';
/**
 * log module
 * @module api/log
 * @see module:index
 */
module.exports = function () {
  if (process.env.ZFINDER_DEBUG.toString() === 'true') {
    console.log.apply(console, arguments);
  }
};
