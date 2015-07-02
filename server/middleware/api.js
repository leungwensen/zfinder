/* jshint strict: true, undef: true, unused: true */
/* global require, module */

var url = require('url'),
    contentSearch = require('./api/contentSearch'),
    globSearch = require('./api/globSearch'),
    apiLs = require('./api/ls');

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
            default:
                return next();
        }
    };
};
