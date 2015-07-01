/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname */

var pkg = require('../package.json'),
    connect = require('connect'),
    open = require("open"),
    pastry = require('pastry'),
    path = require('path'),
    serveStatic = require('serve-static'),
    dump = require('./utils/dump'),
    help = require('./utils/help'),
    serveApis = require('./middleware/api'),
    serveDirectories = require('./middleware/directory'),
    serveFiles = require('./middleware/file');

module.exports = {
    serve: function(opts) {
        if (opts.help) {
            return dump(help);
        }
        if (opts.version) {
            return dump(pkg.version);
        }
        var server = connect(),
            sprintf = pastry.sprintf;

        // middlewares {
            server.use( // serve directories
                serveDirectories(opts.root, opts)
            );
            server.use( // apis
                opts.apiRoot,
                serveApis(opts)
            );
            server.use( // specified files
                serveFiles(opts)
            );

            // serve only static files {
                server.use( // serve server files
                    opts.serverRoot,
                    serveStatic(path.resolve(__dirname, '../'))
                );
                server.use( // serve static files
                    serveStatic(opts.root)
                );
            // }
        // }
        // start server {
            server.listen(opts.port);
            open(sprintf('http://127.0.0.1:%d/', opts.port));
        // }
    }
};

