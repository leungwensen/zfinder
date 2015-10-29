/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var Route = require('zfinder-route');
var arrayUtils = require('zero-lang-array');
var bodyParser = require('body-parser');
var colors = require('colors/safe');
var connect = require('connect');
var connectRedirection = require('connect-redirection');
var getInstalledPath = require('module-path');
var getPort = require('get-port');
var json = require('zero-encoding-json');
var objectUtils = require('zero-lang-object');
var path = require('path');
var serveStatic = require('serve-static');
var sprintf = require('zero-fmt-sprintf');
var url = require('url');
var urlrouter = require('urlrouter');
var utils = require('zfinder-utils');

function startServer(server, config) {
    server.listen(config.port);
    var url = sprintf('http://127.0.0.1:%d/', config.port);
    utils.log(colors.grey('\n[INFO: zfinder server started!]'));
    utils.log(colors.grey('url: ') + colors.green(url));
    if (config.open) {
        require('open')(url);
    }
}

module.exports = function (config) {
    // put necessary options to process.envs
    process.env.ZFINDER_DEBUG = config.debug;

    var server = connect();

    // add middleware functionalities {
        server
            // FIXME body is not available until you set the correct headers
            .use(bodyParser.json()) // parse json body
            .use(bodyParser.urlencoded({extended: true})) // parse urlencoded body
            .use(bodyParser.raw()) // parse raw body
            .use(bodyParser.text()) // parse text body
            .use(connectRedirection()) // res.redirect()
            .use(function(req, res, next) {
                var urlInfo = url.parse(req.url, true);
                var query = urlInfo.query || {};
                var body = req.body || {};

                // add req._urlInfo, etc
                req._urlInfo = urlInfo;
                req._pathname = decodeURIComponent(urlInfo.pathname);

                // add req._params (combination of query and body)
                req._params = objectUtils.extend({}, query, body);

                // add req._mw (check which middleware to run)
                req._mw = req._params._mw || '';

                // res._JSONRes(data) (generate JSON response)
                res._JSONRes = function(data) {
                    var body = json.stringify(data);
                    var buf = new Buffer(body, 'utf8');
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.setHeader('Content-Length', buf.length);
                    res.end(buf);
                };

                // res._HTMLRes(data) (generate HTML response)
                res._HTMLRes = function(data) {
                    var buf = new Buffer(data);
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    res.setHeader('Content-Length', buf.length);
                    res.end(buf);
                };

                next();
            });
    // }

    // process middlewares {
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
                    route.server = route.serve(options, config);
                    routes.push(route);
                });

                var partsOfMwname = mwName.split(path.sep); // for local ones
                var serverName = partsOfMwname[partsOfMwname.length - 1];
                server.use(
                    sprintf('%s/%s', config.path.middlewareRoot, serverName),
                    serveStatic(options.local ? mwName : getInstalledPath(mwName, __dirname))
                );
                // theme for middleware
                if (mw.theme) {
                    server.use(
                        sprintf('%s/%s/theme', config.path.middlewareRoot, serverName),
                        serveStatic(mw.theme) // FIXME should be absolute path
                    );
                }
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
        arrayUtils.each(routes, function(route) {
            server.use(urlrouter(function (app) {
                utils.log(colors.grey(
                    sprintf('\n[INFO: route %s applying]', route.name)
                ));
                utils.log(function(){ route.print(); });

                app[route.method](route.url, route.server);

                utils.log(colors.grey(
                    sprintf('[INFO: route %s applied]', route.name)
                ));
            }));
        });
    // }

    // basic server {
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
    // }

    // start server {
        if (config.port) {
            startServer(server, config);
        } else {
            getPort(function(err, port) {
                if (err) throw err;
                config.port = port;
                startServer(server, config);
            });
        }
    // }
};

