/* jshint strict: true, undef: true, unused: true */
/* global require, module */

var fs = require('fs'),
    url = require('url'),
        urlParse = url.parse,
    join = require('path').join,
    pastry = require('pastry'),
        each = pastry.each,
        indexOf = pastry.indexOf,
        map = pastry.map,
    utils = require('../../utils/middleware'),
        extname = utils.extname,
        processFile = utils.processFile,
        removeHidden = utils.removeHidden,
        genJSONRes = utils.genJSONRes;

module.exports = function(req, res, next, options) {
    'use strict';

    var urlInfo = urlParse(req.url, true),
        query = urlInfo.query,
        root = options.root;
    if (req.method === 'GET') {
        var currentPath = query.path;
        fs.readdir(currentPath, function(err, files) {
            var result = [];
            if (err) {
                return next(err);
            }
            if (!query.hidden) {
                files = removeHidden(files);
            }
            if (!!query.filter) {
                each(query.filter.split(','), function(type) {
                    switch (type) {
                        case 'file':
                            result = result.concat(files.filter(function(file) {
                                try {
                                    return fs.statSync(join(currentPath, file)).isFile();
                                } catch (e) {
                                    return false;
                                }
                            }));
                            break;
                        case 'directory':
                            result = result.concat(files.filter(function(file) {
                                try {
                                    return fs.statSync(join(currentPath, file)).isDirectory();
                                } catch (e) {
                                    return false;
                                }
                            }));
                            break;
                        case 'markdown':
                            result = result.concat(files.filter(function(file) {
                                return indexOf([
                                    'markdown',
                                    'md'
                                ], extname(file)) > -1;
                            }));
                            break;
                        default:
                            break;
                    }
                });
            } else {
                result = files;
            }
            //result.reverse();
            result = map(result, function(filename) {
                return processFile(currentPath, root, filename);
            });
            genJSONRes(result, res);
        });
    } else {
        next();
    }
};

