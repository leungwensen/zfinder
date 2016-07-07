'use strict';
/**
 * load-yaml module
 * @module common/load-yaml
 * @see module:index
 */

const fs = require('fs');
const yaml = require('js-yaml');

module.exports = (filename, defaultValue) => {
  try {
    return yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
  } catch (e) {
    return defaultValue;
  }
};
