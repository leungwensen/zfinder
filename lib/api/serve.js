'use strict';
/**
 * serve module
 * @module api/serve
 * @see module:index
 */

const bodyParser = require('body-parser');
const colors = require('colors/safe');
const connect = require('connect');
const connectRedirection = require('connect-redirection');
const favicon = require('serve-favicon');
const getInstalledPath = require('module-path');
const getPort = require('get-port');
const httpErrors = require('http-errors');
const lang = require('zero-lang');
const path = require('path');
const serveStatic = require('serve-static');
const url = require('url');
const urlrouter = require('urlrouter');
const open = require('open');
const log = require('./log');

function startServer(server, config) {
  server.listen(config.port);
  const url = `http://127.0.0.1:${config.port}/`;
  log(colors.grey('\n[INFO: zfinder server started!]'));
  log(colors.grey('url: ') + colors.green(url));
  if (config.open) open(url);
}

module.exports = (rc) => {
  // put necessary options to process.envs
  process.env.ZFINDER_DEBUG = rc.debug;

  const server = connect();
  const root = rc.root;

  // add middleware functionalities
  server
    // FIXME body is not available until you set the correct headers
    .use(bodyParser.json()) // parse json body
    .use(bodyParser.urlencoded({
      extended: true
    })) // parse urlencoded body
    .use(bodyParser.raw()) // parse raw body
    .use(bodyParser.text()) // parse text body
    .use(connectRedirection()) // res.redirect()
    .use((req, res, next) => {
      const urlInfo = url.parse(req.url, true);
      const query = urlInfo.query || {};
      const body = req.body || {};

      // add req._urlInfo, req._pathname, etc
      req._urlInfo = urlInfo;
      const pathname = path.normalize(path.join(root, decodeURIComponent(urlInfo.pathname)));
      if (~pathname.indexOf('\0')) {
        // null byte(s), bad request
        return next(httpErrors(400));
      }
      if ((pathname + path.sep).substr(0, root.length) !== root) {
        // malicious path
        return next(httpErrors(403));
      }
      req._pathname = urlInfo.pathname;
      req._normalizedPathname = pathname;

      // add req._params (combination of query and body)
      req._params = lang.extend({}, query, body);
      req._query = query;
      req._body = body;

      // add req._handler (check which handler to run)
      req._handler = req._params._handler || '';

      // res._JSONRes(data) (generate JSON response)
      res._JSONRes = data => {
        const body = json.stringify(data);
        const buf = new Buffer(body, 'utf8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
      };

      // res._HTMLRes(data) (generate HTML response)
      res._HTMLRes = data => {
        const buf = new Buffer(data);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
      };

      next();
    });

  // process handlers
  const handlers = rc.handler || {};
  const routes = [];
  lang.forIn(handlers, (options, handlerName) => {
    options = options || {};
    let mw;
    try {
      log(colors.grey(
        sprintf('\n[INFO: middleware %s processing]', mwName)
      ));
      mw = require(mwName);
    } catch (e) {
      console.error(
        colors.red('[ERROR: middleware no found]'),
        colors.grey('try to install it:'),
        sprintf('npm install %s -g', mwName)
      );
    }
    if (mw && mw.getRoutes) {
      lang.each(mw.getRoutes(), route => {
        route.server = route.serve(options, config);
        routes.push(route);
      });

      const partsOfMwname = mwName.split(path.sep); // for local ones
      const serverName = partsOfMwname[partsOfMwname.length - 1];
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
      log(colors.grey(
        sprintf('[INFO: middleware %s processed]', mwName)
      ));
    }
  });
  // sort by priority
  routes.sort((a, b) => b.priority - a.priority);
  // apply middlewares
  lang.each(routes, route => {
    console.log(route);
    server.use(urlrouter(app => {
      log(colors.grey(
        sprintf('\n[INFO: route %s applying]', route.name)
      ));
      log(() => {
        route.print();
      });

      app[route.method](route.url, route.server);

      log(colors.grey(
        sprintf('[INFO: route %s applied]', route.name)
      ));
    }));
  });

  // basic server
  // serve zfinder files
  log(colors.grey('\n[INFO: route zfinder:get applying]'));
  log(() => {
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
  log(colors.grey('[INFO: route zfinder:get applied]'));

  // if no middleware matched, fallback to a static file server
  log(colors.grey('\n[INFO: route static-files:get applying]'));
  log(() => {
    Route.standardOutput({
      name: 'static-files:get',
      method: 'get',
      url: '*',
    });
  });
  server.use(
    serveStatic(root, {
      dotfiles: 'allow'
    })
  );
  log(colors.grey('[INFO: route static-files:get applied]'));

  // favicon.ico
  server.use(favicon(config.favicon));

  // start server
  if (config.port) {
    startServer(server, config);
  } else {
    getPort((err, port) => {
      if (err) throw err;
      config.port = port;
      startServer(server, config);
    });
  }
};
