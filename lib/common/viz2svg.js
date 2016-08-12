'use strict';
/**
 * viz2svg module
 * @module viz2svg
 * @see module:index
 */
const viz = require('viz.js');

module.exports = (str, engine) => viz(str, {
  engine,
  format: 'svg',
});
