/* jshint strict: false, undef: true, unused: true */
/* global require, module */

var fs = require('fs'),
    path = require('path'),
        resolve = path.resolve,
    url = require('url'),
    pastry = require('pastry'),
        map = pastry.map,
    glob = require('glob'),
    utils = require('../utils/middleware'),
        processFile = utils.processFile,
    contentSearch = require('../utils/contentSearch');

module.exports = function(options) {
    //function getQuery(req) {
        //return url.parse(req.url, true).query;
    //}
    function removeHidden(files) {
        return files.filter(function(file){
            return '.' != file[0];
        });
    }
    return function(req, res, next) {
        var urlInfo = url.parse(req.url, true),
            query = urlInfo.query,
            pathname = urlInfo.pathname,
            partPath = pathname.replace(options.apiRoot, ''),
            root = options.root;
        switch (partPath) {
            case '/ls':
                switch (req.method) {
                    case 'GET':
                        var currentPath = query.path;
                        fs.readdir(currentPath, function(err, files) {
                            var result = [];
                            if (err) {
                                return next(err);
                            }
                            if (!options.hidden) {
                                files = removeHidden(files);
                            }
                            if (options.filter) {
                                files = files.filter(function(filename, index, list) {
                                    return options.filter(filename, index, list, currentPath);
                                });
                            }
                            files.reverse();
                            result = map(files, function(filename) {
                                return processFile(currentPath, root, filename);
                            });
                            utils.genJSONRes(result, res);
                        });
                        break;
                    default:
                        return next();
                }
                break;
            case '/search':
                switch (req.method) {
                    case 'GET':
                        var q = query.query;
                        switch (query.type) {
                            case 'glob':
                                glob(q, {
                                    cwd: root,
                                    root: root,
                                    nosort: true,
                                }, function(err, files) {
                                    if (err) {
                                        utils.genJSONRes({
                                            glob: []
                                        }, res);
                                    } else {
                                        utils.genJSONRes({
                                            glob: map(files, function(filename) {
                                                return processFile(root, root, filename.replace(root, ''));
                                            })
                                        }, res);
                                    }
                                });
                                break;
                            case 'content':
                                contentSearch(q, {
                                    root: root
                                }, function(err, files) {
                                    if (err) {
                                        utils.genJSONRes({
                                            content: []
                                        }, res);
                                    } else {
                                        utils.genJSONRes({
                                            content: files
                                        }, res);
                                    }
                                });
                                break;
                            default:
                                return next();
                        }
                        break;
                    default:
                        return next();
                }
                break;
            default:
                return next();
        }
    };
};
