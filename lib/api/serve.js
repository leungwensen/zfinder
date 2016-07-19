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
const try2get = require('try2get');
const log = require('./log');

function startServer(server, rc) {
  server.listen(rc.port);
  const url = `http://127.0.0.1:${rc.port}/`;
  log(colors.grey('\n[INFO: zfinder server started!]'));
  log(colors.grey('url: ') + colors.green(url));
  if (rc.openOnStart) open(url);
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
    let handler;
    try {
      log(colors.grey(`\n[INFO: handler ${handlerName} processing]`));
      handler = try2get.one([
        () => require(`../handler/${handlerName}`),
        () => require(handlerName),
      ]);
    } catch (e) {
      console.error(
        colors.red('[ERROR: handler no found]'),
        colors.grey('try to install it:'),
        `npm install ${handlerName} -g`
      );
    }
    if (handler) {
      routes.push(handler.toRoute(options, rc));
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

  // serve zfinder files
  log(colors.grey('\n[INFO: route zfinder:get applying]'));

  server.use(
    rc.path.zfinder,
    serveStatic(path.resolve(__dirname, '../../'))
  );
  log(colors.grey('[INFO: route zfinder:get applied]'));

  // if no handlers matched, fallback to a static file server
  log(colors.grey('\n[INFO: route static-files:get applying]'));
  server.use(
    serveStatic(root, {
      dotfiles: rc.dotfiles
    })
  );
  log(colors.grey('[INFO: route static-files:get applied]'));

  // favicon.ico
  server.use(favicon(rc.favicon));

  // start server
  if (rc.port) {
    startServer(server, rc);
  } else {
    getPort((err, port) => {
      if (err) throw err;
      rc.port = port;
      startServer(server, rc);
    });
  }
};
