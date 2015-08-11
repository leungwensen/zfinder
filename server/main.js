/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname */

var pkg = require('../package.json');
var connect = require('connect');
var bodyParser = require('body-parser');
var open = require('open');
var pastry = require('pastry'),
    sprintf = pastry.sprintf;
var path = require('path'),
    resolve = path.resolve;
var serveStatic = require('serve-static');

var dump = require('./utils/dump');
var help = require('./utils/help');

var serveApis = require('./middleware/api');
var serveApps = require('./middleware/app');
var serveDirectories = require('./middleware/directory');
var serveFiles = require('./middleware/file');

module.exports = {
    serve: function(opts) {
        if (opts.help) {
            return dump(help);
        }
        if (opts.version) {
            return dump(pkg.version);
        }

        var server = connect();
        var root = opts.root;
        var serverRoot = resolve(__dirname, '../');

        // middlewares {
            server.use(bodyParser.urlencoded({
                extended: true
            }));

            server.use( // serve directories
                serveDirectories(root, opts)
            );
            //server.use( // serve server root directories
                //opts.serverRoot,
                //serveDirectories(serverRoot, opts)
            //);
            server.use( // apis
                opts.apiRoot,
                serveApis(opts)
            );
            server.use( // apps
                opts.appRoot,
                serveApps(opts)
            );
            server.use( // specified files
                serveFiles(opts)
            );

            // serve only static files {
                server.use( // serve server files
                    opts.serverRoot,
                    serveStatic(serverRoot)
                );
                server.use( // serve static files
                    serveStatic(root)
                );
            // }
        // }
        // start server {
            server.listen(opts.port);
        // }
        // open in browser {
            if (!opts.dev) {
                open(sprintf('http://127.0.0.1:%d/', opts.port));
            }
        // }
    }
};

