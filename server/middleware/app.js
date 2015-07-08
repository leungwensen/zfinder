/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname */

var path = require('path'),
        join = path.join,
    pastry = require('pastry'),
        json = pastry.json,
    url = require('url'),
    utils = require('../utils/middleware'),
        genHTMLRes = utils.genHTMLRes,
        genTemplateRender = utils.genTemplateRender,
    templateByName = {
        markdownEditor: genTemplateRender(
            join(__dirname, '../template/app-markdownEditor.html')
        )
    };

module.exports = function(options) {
    'use strict';

    return function(req, res/*, next*/) {
        var urlInfo = url.parse(req.url, true),
            pathname = urlInfo.pathname,
            partPath = pathname.replace(options.apiRoot, '');
        switch (partPath) {
            case '/markdownEditor':
                genHTMLRes(
                    templateByName.markdownEditor({
                        options: options,
                        jsonStr: json.stringify(options),
                    }, pastry, true),
                    res
                );
                break;
            default:
                // 默认跳转回普通连接 {
                    res.writeHead(301, {
                        Location: partPath
                    });
                    res.end();
                // }
                break;
        }
    };
};
