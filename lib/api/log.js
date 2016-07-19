'use strict';
/**
 * log module
 * @module api/log
 * @see module:index
 */
const lang = require('zero-lang');

function log(text) {
  if (process.env.ZFINDER_DEBUG.toString() === 'true') {
    if (lang.isString(text)) {
      console.log(text);
    }
    if (lang.isFunction(text)) {
      text();
    }
  }
}

module.exports = (text) => {
  if (lang.isArray(text)) {
    lang.each(text, (l) => log(l));
  } else {
    log(text);
  }
};
