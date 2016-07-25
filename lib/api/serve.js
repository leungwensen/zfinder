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
const decodeUri = require('../common/decode-uri');
const isHidden = require('../common/is-hidden');

function startServer(server, rc) {
  server.listen(rc.port);
  const link = `http://127.0.0.1:${rc.port}/`;
  log(colors.grey('\n[INFO: zfinder server started!]'));
  log(colors.grey('url: ') + colors.green(link));
  if (rc.openOnStart) open(link);
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
      const decodedPathname = decodeUri(urlInfo.pathname);
      const pathname = path.normalize(path.join(root, decodedPathname));

      // null byte(s), bad request
      if (~pathname.indexOf('\0')) return next(httpErrors(400));

      // malicious path
      if ((pathname + path.sep).substr(0, root.length) !== root) return next(httpErrors(403));

      req._urlInfo = urlInfo;
      req._pathname = urlInfo.pathname;
      req._decodedPathname = decodedPathname;
      req._normalizedPathname = pathname;

      if (rc.dotfiles !== 'allow' && isHidden(req._normalizedPathname)) return next(httpErrors(400));

      // add req._params (combination of query and body)
      req._params = lang.extend({}, query, body);
      req._query = query;
      req._body = body;

      // add req._handler (check which handler to run)
      req._handler = req._params._handler || '';

      // res._JSONRes(data) (generate JSON response)
      res._JSONRes = data => {
        const str = JSON.stringify(data);
        const buf = new Buffer(str, 'utf8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
      };
      // TODO res._JSONError()

      // res._HTMLRes(data) (generate HTML response)
      res._HTMLRes = data => {
        const buf = new Buffer(data);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
      };

      return next();
    }
  )
  ;

  // process handlers
  const handlerOptionsByName = rc.handler || {};
  const handlers = [];
  lang.forIn(handlerOptionsByName, (options, handlerName) => {
    options = options || {};
    log(colors.grey(`\n[INFO: handler ${handlerName} processing]`));
    const handler = try2get.one([
      () => require(`../handler/${handlerName}`),
      () => require(handlerName),
    ]);

    if (handler) {
      handlers.push(handler);
      handler.route = handler.toRoute(options, rc);
    } else {
      console.error(
        colors.red('[ERROR: handler no found]'),
        colors.grey('try to install it:'),
        `npm install ${handlerName} -g`
      );
    }
  });

  // sort by priority
  handlers.sort((a, b) => b.priority - a.priority);

  // apply routes
  lang.each(handlers, (handler) => {
    server.use(urlrouter(app => {
      log(colors.grey(`\n[INFO: handler ${handler.name} applying]`));
      log(() => {
        handler.print();
      });

      app[handler.method](handler.url, handler.route);
      log(colors.grey(`[INFO: handler ${handler.name} applied]`));
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
