#!/usr/bin/env node
/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var commander = require('commander');
var inquirer = require('inquirer');
var sprintf = require('zero-fmt/sprintf');
var path = require('path');

var pkg = require(path.resolve(__dirname, '../package.json'));

function list(val) {
    return val.split(',');
}

commander
    .version(pkg.version);

// start a new zfinder server
commander
    .command('serve [root]')
    .description('start a zfinder server')
    .option('-o, --open', 'open on start')
    .option('-p, --port <port>', 'specify the port which server will run on')
    .option('-c, --config <config>', 'specify the configuration file')
    .option('-l, --localmiddleware <middleware>', 'specify paths to local middlewares', list)
    .action(function(root, options) {
        require('../lib/serve')(
            require('../lib/config-server')(root, options)
        );
    });

// build a path
commander
    .command('build [root]')
    .description('run zfinder building task')
    .option('-c, --config <config>', 'specify the configuration file')
    .option('-r, --recursively', 'build all files recursively')
    .action(function(root, options) {
        require('../lib/build')(root, options);
    });

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

commander.on('--help', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    $ zfinder-cli serve --open --port 9090 --config ./config.yaml --localmiddleware ~/path/to/local/middlewares');
    console.log('    $ zfinder-cli serve -o -p 9090 -c ./config.yaml -l ~/path/to/local/middlewares');
    console.log('    $ zfinder-cli build --recursively --config ./config.yaml');
    console.log('    $ zfinder-cli build --r -c ./config.yaml');
    console.log('    $ zfinder-cli create-middleware sample-mwname --root ~/repo/');
    console.log('    $ zfinder-cli create-middleware sample-mwname --r ~/repo/');
    console.log('    $ zfinder-cli killall');
    console.log('    $ zfinder-cli --help');
    console.log('    $ zfinder-cli -h');
    console.log('    $ zfinder-cli --version');
    console.log('    $ zfinder-cli -V');
    console.log('');
});

commander.parse(process.argv);

if (process.argv.length === 2) {
    commander.outputHelp();
}

