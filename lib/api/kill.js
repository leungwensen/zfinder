'use strict';
/**
 * kill module
 * @module api/kill
 * @see module:index
 */

const lang = require('zero-lang');
const shelljs = require('shelljs');
const sudo = require('sudo');

module.exports = () => {
  const psOutput = shelljs.exec('ps ux | grep zfinder', {silent: true}).stdout;

  if (psOutput) {
    lang.each(psOutput.split('\n'), (line) => {
      const parts = line.split(/\s+/);
      if (parts.length >= 12) {
        const cmd = parts[10];
        const zfinderScript = parts[11];
        const pid = parts[1];
        // if it is a zfinder process
        if (cmd.match(/node$/) && zfinderScript.match(/[zfinder|zfinder\-cli](\.js)?$/)) {
          console.log(`[KILLING]: ${line}`);
          const child = sudo(['kill', '-9', pid], {
            cachePassword: true,
            prompt: 'Input Sudo Password:',
            spawnOptions: {
              /* other options for spawn */
            }
          });
          child.stdout.on('data', (data) => {
            console.log(data.toString());
          });
        }
      }
    });
  }
};
