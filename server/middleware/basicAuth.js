/* jshint strict: false, undef: true, unused: true, node: true */

var http = require('http');
var url = require('url'),
    parseUrl = url.parse;
var pastry = require('pastry'),
    some = pastry.some;

var utils = require('../utils/middleware'),
    decodeUriStr = utils.decodeUriStr;

module.exports = function(authInfo) {
    var users = authInfo.users;
    var ignore = authInfo.ignore || [];
    var realm = 'Authorization Required';

    function unauthorized(res, realm) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
        res.end('Unauthorized');
    }
    function error(code, msg){
        var err = new Error(msg || http.STATUS_CODES[code]);
        err.status = code;
        return err;
    }
    function callback(user, pass) {
        return users[user] && users[user] === pass;
    }

    return function(req, res, next) {
        var urlInfo = parseUrl(req.url, true);
        var pathname = decodeUriStr(urlInfo.pathname); // !!!node.js should do this for us!!!
        if (some(ignore, function(i) {
            try {
                var reg = new RegExp(i);
console.log(i);
console.log(reg);
console.log(pathname);
console.log(reg.test(pathname));
                return reg.test(pathname);
            } catch(e) {
            }
            return false;
        })) {
            return next();
        }

        var authorization = req.headers.authorization;

        if (req.user) {
            return next();
        }
        if (!authorization) {
            return unauthorized(res, realm);
        }

        var parts = authorization.split(' ');

        if (parts.length !== 2) {
            return next(error(400));
        }

        var scheme = parts[0];
        var credentials = new Buffer(parts[1], 'base64').toString();
        var index = credentials.indexOf(':');

        if ('Basic' != scheme || index < 0) {
            return next(error(400));
        }

        var user = credentials.slice(0, index);
        var pass = credentials.slice(index + 1);

        if (callback.length >= 3) {
            // async
            callback(user, pass, function(err, user){
                if (err || !user)  return unauthorized(res, realm);
                req.user = req.remoteUser = user;
                return next();
            });
        } else {
            // sync
            if (callback(user, pass)) {
                req.user = req.remoteUser = user;
                return next();
            } else {
                unauthorized(res, realm);
            }
        }
    };
};

