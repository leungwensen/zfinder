'use strict';
/**
 * loadRC module
 * @module api/load-runtime-configuration
 * @see module:index
 */

const fs = require('fs');
const lang = require('zero-lang');
const loadYaml = require('../common/load-yaml');
const path = require('path');

const CLI_OPTIONS = [
  'open',
  'port'
];
const DEFAULT_FAVICON = path.resolve(__dirname, '../favicon.ico');

module.exports = (root, options) => {
  root = root || process.cwd();
  options = options || {};
  const rc = {
    root,
  };
  const zfinderRCFilename = '.zfinderrc.yaml';

  lang.merge(
    rc,
    loadYaml(path.resolve(__dirname, `../${zfinderRCFilename}`)),
    loadYaml(path.resolve('~', zfinderRCFilename)),
    loadYaml(path.resolve(root, zfinderRCFilename))
  );

  lang.each(CLI_OPTIONS, (option) => {
    if (lang.hasKey(options, option)) rc[option] = options[option];
  });

  if (rc.favicon) {
    try {
      fs.accessSync(rc.favicon);
    } catch (e) {
      rc.favicon = DEFAULT_FAVICON;
    }
  } else {
    rc.favicon = DEFAULT_FAVICON;
  }

  return rc;
};
