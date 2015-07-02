/* jshint strict: true, undef: true, unused: true */
/* global require, module */

var fs = require('fs'),
    url = require('url'),
        urlParse = url.parse,
    pastry = require('pastry'),
        map = pastry.map,
    utils = require('../../utils/middleware'),
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
            if (query.type) {
                switch (query.type) {
                    case 'file':
                        files = files.filter(function(file) {
                            try {
                                return fs.statSync(file).isFile();
                            } catch (e) {
                                return false;
                            }
                        });
                        break;
                    case 'directory':
                        files = files.filter(function(file) {
                            try {
                                return fs.statSync(file).isDirectory();
                            } catch (e) {
                                return false;
                            }
                        });
                        break;
                    default:
                        break;
                }
            }
            files.reverse();
            result = map(files, function(filename) {
                return processFile(currentPath, root, filename);
            });
            genJSONRes(result, res);
        });
    } else {
        next();
    }
};

