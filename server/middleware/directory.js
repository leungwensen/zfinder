/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname, Buffer */

var fs = require('fs');
var path = require('path'),
    normalize = path.normalize,
    sep = path.sep,
    join = path.join,
    resolve = path.resolve;
var url = require('url'),
    parseUrl = url.parse;
var pastry = require('pastry'),
    some = pastry.some,
    extend = pastry.extend,
    json = pastry.json;
var createError = require('http-errors');
var utils = require('../utils/middleware'),
    genTemplateRender = utils.genTemplateRender;

var pageRender = genTemplateRender(
    join(__dirname, '../template/directory.html')
);

module.exports = function(root, options) {
    options = options || {};
    if (!root) {
        throw 'root path required.';
    }

    return function(req, res, next) {
        var rootPath = normalize(resolve(root) + sep),
            url = parseUrl(req.url),
            originUrl = parseUrl(req.originUrl || req.url),
            dir = decodeURIComponent(url.pathname),
            originDir = decodeURIComponent(originUrl.pathname),
            currentPath = normalize(join(rootPath, dir));

        if (~currentPath.indexOf('\0')) {
            // null byte(s), bad request
            return next(createError(400));
        }
        if ((currentPath + sep).substr(0, rootPath.length) !== rootPath) {
            // malicious path
            return next(createError(403));
        }

        fs.stat(currentPath, function(err, stat) {
            if (err) {
                switch (err.code) {
                    case 'ENOENT':
                        // if exists, redirect to html/htm/md/markdown {
                            var tryFilePath;
                            some([
                                'html',
                                'htm',
                                'markdown',
                                'md'
                            ], function(ext) {
                                tryFilePath = currentPath + '.' + ext;
                                try {
                                    if (fs.statSync(tryFilePath)) {
                                        res.writeHead(301, {
                                            Location: dir + '.' + ext
                                        });
                                        res.end();
                                    }
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            });
                        // }
                        return next();
                    case 'ENAMETOOLONG':
                        err.status = 414;
                        return next(err);
                    default:
                        err.status = 500;
                        return next(err);
                }
            }
            if (!stat.isDirectory()) {
                // not a directory
                return next();
            }
            var variables = extend({
                    dir: dir,
                    originDir: originDir,
                    originUrl: originUrl,
                    path: currentPath,
                    root: rootPath,
                    url: url,
                }, options),
                buf = new Buffer(pageRender({
                    options: variables,
                    CONST_JSON: json.stringify(variables),
                }, pastry, true), 'utf8');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Content-Length', buf.length);
            res.end(buf);
        });
    };
};
