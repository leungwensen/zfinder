/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var arrayUtils = require('zero-lang-array');
var bodyParser = require('body-parser');
var connect = require('connect');
var getInstalledPath = require('get-installed-path');
var getPort = require('get-port');
var objectUtils = require('zero-lang-object');
var path = require('path');
var serveStatic = require('serve-static');
var sprintf = require('zero-fmt-sprintf');
var urlrouter = require('urlrouter');

function startServer(server, config) {
    server.listen(config.port);
    var url = sprintf('http://127.0.0.1:%d/', config.port);
    if (config.debug) {
        console.log('zfinder server started!');
        console.log(sprintf('url: %s', url));
    }
    if (config.openOnStart) {
        require('open')(url);
    }
}

module.exports = function (config) {
    // put necessary options to process.envs
    process.env.ZFINDER_DEBUG = config.debug;

    var server = connect();

    // parse body
    server.use(bodyParser.urlencoded({
        extended: true
    }));


    // process middlewares
    var middlewares = config.middleware;
    var routes = [];
    objectUtils.each(middlewares, function(options, mwName) {
        var mw;
        try {
            mw = require(mwName);
        } catch(e) {
            console.error(sprintf('zfinder middleware: %s cannot be found', mwName));
            console.error(sprintf('try to install it: npm install %s -g', mwName));
            throw e;
        }
        //if (!mw.constructor.validate(mw)) {
        //}
        arrayUtils.each(mw.routes, function(route) {
            routes.push({
                priority: route.priority,
                method: route.method,
                url: route.url,
                serve: route.serve(options)
            });
        });
        server.use(
            sprintf('%s/%s', config.middlewareRoot, mwName),
            serveStatic(getInstalledPath(mwName))
        );
    });
    // sort by priority
    routes.sort(function(a, b) {
        return b.priority - a.priority;
    });
    // apply middlewares
    server.use(urlrouter(function (app) {
        arrayUtils.each(routes, function(route) {
            app[route.method](route.url, route.serve);
        });
    }));

    // serve zfinder files
    server.use(
        config.zfinderRoot,
        serveStatic(path.resolve(__dirname, '../'))
    );

    // fallback to static files server
    server.use(
        serveStatic(config.root)
    );

    // start server
    if (config.port) {
        startServer(server, config);
    } else {
        getPort(function(err, port) {
            if (err) throw err;
            config.port = port;
            startServer(server, config);
        });
    }
};

