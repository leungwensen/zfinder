'use strict';
/**
 * index module
 * @module index
 * @see module:bin/zfinder
 */
const Handler = require('./handler/base');
const kill = require('./api/kill');
const loadRC = require('./api/load-runtime-configuration');
const serve = require('./api/serve');
const log = require('./api/log');

module.exports = {
  Handler,
  log,
  kill,
  loadRC,
  loadRuntimeConfiguration: loadRC,
  serve,
};
