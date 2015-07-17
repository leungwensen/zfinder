/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname */

var fs = require('fs'),
    path = require('path'),
        join = path.join,
        relative = path.relative,
    url = require('url'),
        parseUrl = url.parse,
    pastry = require('pastry'),
    utils = require('../utils/middleware'),
        extname = utils.extname,
        readFile = utils.readFile,
        genHTMLRes = utils.genHTMLRes,
        genTemplateRender = utils.genTemplateRender,
    nameByExt = {
        markdown: 'markdown',
        md: 'markdown'
    },
    templateByName = {
        markdown: genTemplateRender(
            join(__dirname, '../template/file-markdown.html')
        )
    };

module.exports = function(options) {
    return function(req, res, next) {
        var root = options.root,
            urlInfo = parseUrl(req.url, true),
            pathname = join(root, urlInfo.pathname),
            ext = extname(pathname);

        if (fs.existsSync(pathname)) {
            switch (nameByExt[ext]) {
                case 'markdown':
                    var filename = relative(options.root, pathname);
                    genHTMLRes(
                        templateByName.markdown({
                            content: readFile(pathname),
                            options: options,
                            filename: filename,
                        }, pastry, true),
                        res
                    );
                    break;
                default:
                    next();
                    break;
            }
        } else {
            next();
        }
    };
};

