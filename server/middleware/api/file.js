/* jshint strict: true, undef: true, unused: true */
/* global require, module */

var path = require('path'),
        resolve = path.resolve,
    url = require('url'),
        urlParse = url.parse,
    utils = require('../../utils/middleware'),
        readFile = utils.readFile,
        writeFile = utils.writeFile,
        processFile = utils.processFile,
        genJSONRes = utils.genJSONRes;

module.exports = function(req, res, next, options) {
    'use strict';

    var method = req.method,
        root = options.root,
        relativePath,
        filepath,
        result;
    if (method === 'GET') {
        var urlInfo = urlParse(req.url, true),
            query = urlInfo.query;
        relativePath = query.path;
        filepath = resolve(root, relativePath);
        result = processFile(root, root, relativePath);
        result.content = readFile(filepath);
        genJSONRes(result, res);
    } else if (method === 'POST') {
        var body = req.body;
        relativePath = body.path;
        filepath = resolve(root, relativePath);
        writeFile(filepath, body.content);
        genJSONRes({
            success: true
        }, res);
    } else {
        next();
    }
};

