'use strict';
/**
 * basic-auth module
 * @module basic-auth
 * @see module:index
 */
const http = require('http');
const path = require('path');
const url = require('url');
const lang = require('zero-lang');

const Handler = require('./base');
const decodeUri = require('../common/decode-uri');

const DEFAULT_USERS = {
  zfinder: 'awesome',
};

module.exports = new Handler({
  name: 'basic-auth',
  method: 'all',

  toRoute(options) {
    options.ignores = options.ignores || [];
    const users = options.users || DEFAULT_USERS;
    const ignores = lang.map(options.ignores, (i) => new RegExp(i, 'i'));

    const realm = 'Authorization Required';

    function unauthorized(res, realm) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`);
      res.end('Unauthorized');
    }

    function error(code, msg) {
      const err = new Error(msg || http.STATUS_CODES[code]);
      err.status = code;
      return err;
    }

    function callback(user, pass) {
      return users[user] && users[user] === pass;
    }

    return (req, res, next) => {
      const urlInfo = url.parse(req.url, true);
      // !!!node.js should do this for us!!!
      const pathname = decodeUri(urlInfo.pathname);

      if (lang.some(ignores, (reg) => {
          try {
            return reg.test(pathname);
          } catch (e) {
          }
          return false;
        })) {
        return next();
      }

      const authorization = req.headers.authorization;

      if (req.user) return next();

      if (!authorization) return unauthorized(res, realm);

      const parts = authorization.split(' ');

      if (parts.length !== 2) return next(error(400));

      const scheme = parts[0];
      const credentials = new Buffer(parts[1], 'base64').toString();
      const index = credentials.indexOf(':');

      if ('Basic' != scheme || index < 0) {
        return next(error(400));
      }

      const user = credentials.slice(0, index);
      const pass = credentials.slice(index + 1);

      if (callback.length >= 3) {
        // async
        callback(user, pass, (err, user) => {
          if (err || !user)  return unauthorized(res, realm);
          req.user = req.remoteUser = user;
          return next();
        });
      } else {
        // sync
        if (callback(user, pass)) {
          req.user = req.remoteUser = user;
          return next();
        }
        unauthorized(res, realm);
      }
    };
  }
});
