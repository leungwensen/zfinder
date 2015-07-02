/* jshint strict: true, undef: true, unused: true */
/* global require, module */

var url = require('url'),
        urlParse = url.parse,
    glob = require('glob'),
    pastry = require('pastry'),
        map = pastry.map,
    utils = require('../../utils/middleware'),
        processFile = utils.processFile,
        genJSONRes = utils.genJSONRes;

module.exports = function(req, res, next, options) {
    'use strict';

    var urlInfo = urlParse(req.url, true),
        query = urlInfo.query,
        root = options.root;
    if (req.method === 'GET') {
        glob(query.query, {
            cwd: root,
            root: root,
            nosort: true,
        }, function(err, files) {
            if (err) {
                utils.genJSONRes({
                    glob: []
                }, res);
            } else {
                genJSONRes({
                    glob: map(files, function(filename) {
                        return processFile(root, root, filename.replace(root, ''));
                    })
                }, res);
            }
        });
    } else {
        next();
    }
};

