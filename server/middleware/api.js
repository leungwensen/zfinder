/* jshint strict: true, undef: true, unused: true */
/* global require, module */

var url = require('url'),
    apiLs = require('./api/ls'),
    contentSearch = require('./api/contentSearch'),
    globSearch = require('./api/globSearch'),
    fileApi = require('./api/file');

module.exports = function(options) {
    'use strict';

    return function(req, res, next) {
        var urlInfo = url.parse(req.url, true),
            pathname = urlInfo.pathname,
            partPath = pathname.replace(options.apiRoot, '');
        switch (partPath) {
            case '/ls':
                apiLs(req, res, next, options);
                break;
            case '/search/glob':
                globSearch(req, res, next, options);
                break;
            case '/search/content':
                contentSearch(req, res, next, options);
                break;
            case '/file':
                fileApi(req, res, next, options);
                break;
            default:
                return next();
        }
    };
};
