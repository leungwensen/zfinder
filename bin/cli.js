#!/usr/bin/env node
/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var commander = require('commander');
var inquirer = require('inquirer');
var sprintf = require('zero-fmt-sprintf');

// creating a new middleware for zfinder
commander
    .command('create-middleware [name]')
    .description('create a new zfinder middleware')
    .option('-r, --root <root>', 'specify the root to hold the middleware')
    .action(function(name, options) {
        name = name || '';
        inquirer.prompt([{
            name: 'name',
            message: sprintf('confirm the name [%s]', name)
        }], function (answers) {
            if (answers.name) {
                name = answers.name;
            }
            if (!name) {
                console.error('name cannot be null');
                return;
            }
            if (!/^zfinder-mw-/.test(name)) {
                name = 'zfinder-mw-' + name;
            }
            options.name = name;
            options.root = options.root || process.cwd();
            require('../lib/create-middleware.js')(options);
        });
    });

// kill all zfinder processes
commander
    .command('killall')
    .description('kill all running zfinder instances')
    .action(function() {
        require('../lib/killall.js')();
    });

// start a new zfinder server
commander
    .command('serve [root]')
    .description('start a zfinder server')
    .option('-p, --port <port>', 'specify the port which server will run on')
    .option('-c, --config <config>', 'specify the configuration file')
    .action(function(root, options) {
        require('../lib/serve')(
            require('../lib/config-server')(root, options)
        );
    });


// build a path
commander
    .command('build [root]')
    .description('start a zfinder server')
    .option('-c, --config <config>', 'specify the configuration file')
    .option('-r, --recursively', 'build all files recursively')
    .action(function(root, options) {
        require('../lib/build')(root, options);
    });

commander.parse(process.argv);

