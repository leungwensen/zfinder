/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var Route = require('zfinder-route');
var utils = require('zfinder-utils');
var colors = require('colors/safe');
var arrayUtils = require('zero-lang-array');
var bodyParser = require('body-parser');
var connect = require('connect');
var getInstalledPath = require('module-path');
var getPort = require('get-port');
var objectUtils = require('zero-lang-object');
var path = require('path');
var serveStatic = require('serve-static');
var sprintf = require('zero-fmt-sprintf');
var urlrouter = require('urlrouter');

function startServer(server, config) {
    server.listen(config.port);
    var url = sprintf('http://127.0.0.1:%d/', config.port);
    utils.log(colors.grey('\n[INFO: zfinder server started!]'));
    utils.log(colors.grey('url: ') + colors.green(url));
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
    var middlewares = objectUtils.extend({}, config.middleware, config.localmiddleware);
    var routes = [];
    objectUtils.each(middlewares, function(options, mwName) {
        options = options || {};
        var mw;
        try {
            utils.log(colors.grey(
                sprintf('\n[INFO: middleware %s processing]', mwName)
            ));
            mw = require(mwName);
        } catch(e) {
            console.error(
                colors.red('[ERROR: middleware no found]'),
                colors.grey('try to install it:'),
                sprintf('npm install %s -g', mwName)
            );
        }
        if (mw && mw.getRoutes) {
            arrayUtils.each(mw.getRoutes(), function(route) {
                route.server = route.serve(options);
                routes.push(route);
            });

            var partsOfMwname = mwName.split(path.sep); // for local ones
            var serverName = partsOfMwname[partsOfMwname.length - 1];
            server.use(
                sprintf('%s/%s', config.path.middlewareRoot, serverName),
                serveStatic(options.local ? mwName : getInstalledPath(mwName, __dirname))
            );
            utils.log(colors.grey(
                sprintf('[INFO: middleware %s processed]', mwName)
            ));
        }
    });
    // sort by priority
    routes.sort(function(a, b) {
        return b.priority - a.priority;
    });
    // apply middlewares
    server.use(urlrouter(function (app) {
        arrayUtils.each(routes, function(route) {
            utils.log(colors.grey(
                sprintf('\n[INFO: route %s applying]', route.name)
            ));
            utils.log(function(){ route.print(); });

            app[route.method](route.url, route.server);

            utils.log(colors.grey(
                sprintf('[INFO: route %s applied]', route.name)
            ));
        });
    }));

    // serve zfinder files
    utils.log(colors.grey('\n[INFO: route zfinder:get applying]'));
    utils.log(function() {
        Route.standardOutput({
            name: 'zfinder:get',
            method: 'get',
            url: '*',
        });
    });
    server.use(
        config.path.zfinderRoot,
        serveStatic(path.resolve(__dirname, '../'))
    );
    utils.log(colors.grey('[INFO: route zfinder:get applied]'));

    // if no middleware matched, fallback to a static file server
    utils.log(colors.grey('\n[INFO: route static-files:get applying]'));
    utils.log(function() {
        Route.standardOutput({
            name: 'static-files:get',
            method: 'get',
            url: '*',
        });
    });
    server.use(
        serveStatic(config.root)
    );
    utils.log(colors.grey('[INFO: route static-files:get applied]'));

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

