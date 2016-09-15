'use strict';
/**
 * index module
 * @module index
 * @see module:bin/zfinder
 */
const Handler = require('./handler/base');
const build = require('./api/build');
const kill = require('./api/kill');
const loadRC = require('./api/load-runtime-configuration');
const log = require('./api/log');
const serve = require('./api/serve');

module.exports = {
  Handler,
  log,
  kill,
  loadRC,
  loadRuntimeConfiguration: loadRC,
  serve,
  build,
};
