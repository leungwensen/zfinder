'use strict';
/**
 * index module
 * @module index
 * @see module:bin/zfinder
 */
const Handler = require('./handler/base');
const getAny = require('./common/get-any');
const kill = require('./api/kill');
const loadRC = require('./api/load-runtime-configuration');
const serve = require('./api/serve');
const log = require('./api/log');

module.exports = {
  Handler,
  log,
  getAny,
  kill,
  loadRC,
  loadRuntimeConfiguration: loadRC,
  serve,
};
