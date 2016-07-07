'use strict';
/**
 * getAny module.
 * @module common/get-any
 * @see module:index
 */
const lang = require('zero-lang');

function getAny() {
  const args = lang.flatten(lang.toArray(arguments));
  let returnValue = null;
  lang.some(args, (callback) => {
    try {
      returnValue = callback();
      return true;
    } catch (e) {
      return false;
    }
  });
  return returnValue;
}

module.exports = getAny;
