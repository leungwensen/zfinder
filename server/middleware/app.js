/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname */

var path = require('path'),
    join = path.join;
var pastry = require('pastry'),
    json = pastry.json;
var url = require('url');
var utils = require('../utils/middleware'),
    genHTMLRes = utils.genHTMLRes,
    fixWindowsPath = utils.fixWindowsPath,
    genTemplateRender = utils.genTemplateRender;
var templateByName = {
    markdownEditor: genTemplateRender(
        join(__dirname, '../template/app-markdownEditor.html')
    ),
    mindEditor: genTemplateRender(
        join(__dirname, '../template/app-mindEditor.html')
    )
};

module.exports = function(options) {
    return function(req, res/*, next*/) {
        var urlInfo = url.parse(req.url, true),
            pathname = urlInfo.pathname,
            partPath = pathname.replace(options.apiRoot, '');
        switch (partPath) {
            case '/markdownEditor':
                genHTMLRes(
                    templateByName.markdownEditor({
                        options: options,
                        CONST_JSON: fixWindowsPath(json.stringify(options)),
                    }, pastry, true),
                    res
                );
                break;
            case '/mindEditor':
                genHTMLRes(
                    templateByName.mindEditor({
                        options: options,
                        CONST_JSON: fixWindowsPath(json.stringify(options)),
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
