'use strict';
/**
 * Handler module
 * @module handler/base
 * @see module:index
 */

const colors = require('colors/safe');
const lang = require('zero-lang');
const log = require('../api/log');

const DEFAULT_PROPS = {
  name: 'route',
  method: 'get',
  url: '*',
  // routes will be applied to zfinder server in the order by priority
  priority: 1,
};

function dumpHandlerInfo(handler) {
  log(colors.grey('   name:'), colors.green(handler.name));
  log(colors.grey(' method:'), colors.green(handler.method));
  log(colors.grey('    url:'), colors.green(handler.url));
}

class Handler {
  constructor(options) {
    const me = this;
    lang.extend(me, DEFAULT_PROPS, options);
  }

  toRoute(/* options, rc */) {
    throw new Error('zfinder.Handler: method `toRoute()` should be implemented in instance.');
  }

  print() {
    dumpHandlerInfo(this);
  }
}

module.exports = Handler;
