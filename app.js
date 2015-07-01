#!/usr/bin/env node
/* jshint strict: false, undef: true, unused: true */
/* global require */

var server = require('./server/main'),
    argv = require('minimist')(process.argv.slice(2), {
        default: {
            help: false,
            port: 9090,
            root: process.cwd(),
            version: false,
            // NOTICE {
                // * these options SHOULD NOT BE USED unless you are one of the contributors
                // * these paths should not appears in the specified root
                apiRoot: '/__ZFINDER_API_ROOT__',
                serverRoot: '/__ZFINDER_SERVER_ROOT__',
            // }
        },
        alias: {
            h: 'help',
            p: 'port',
            r: 'root',
            v: 'version',
        }
    });

server.serve(argv);

