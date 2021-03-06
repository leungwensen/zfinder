#!/usr/bin/env node
'use strict';
/**
 * zfinder module
 * @module bin/zfinder
 * @see module:index
 */
const commander = require('commander');
const path = require('path');
const zfinder = require('../lib/index');
const pkg = require(path.resolve(__dirname, '../package.json'));

function dumpUsageExamples() {
  console.log('  Examples:');
  console.log('');
  console.log('    zfinder serve --open --port 9090 [root]');
  console.log('    zfinder serve -o -p 9090 [root]');
  console.log('    zfinder kill');
  console.log('    zfinder --help');
  console.log('    zfinder -h');
  console.log('    zfinder --version');
  console.log('    zfinder -V');
  console.log('');
}

// version
commander
  .version(pkg.version);

// start a new zfinder server
commander
  .command('serve [root]')
  .description('start a zfinder server')
  .option('-o, --open', 'open on start')
  .option('-p, --port <port>', 'specify the port which server will run on')
  .action((root, options) => {
    zfinder.serve(zfinder.loadRC(root, options));
  });

// build a directory
commander
  .command('build [root]')
  .description('build a directory')
  .action((root) => {
    const rc = zfinder.loadRC(root);
    zfinder.build(rc.root, rc);
  });

// kill all zfinder processes
commander
  .command('kill')
  .description('kill all running zfinder instances')
  .action(() => {
    zfinder.kill();
  });

// dump help
commander
  .command('help')
  .description('output usage information')
  .action(() => {
    commander.outputHelp();
  });
commander.on('--help', dumpUsageExamples);

// execute client
commander.parse(process.argv);

if (process.argv.length === 2) commander.outputHelp();
