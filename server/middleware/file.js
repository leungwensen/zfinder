/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname */

var fs = require('fs'),
    path = require('path'),
        join = path.join,
        relative = path.relative,
    url = require('url'),
        parseUrl = url.parse,
    pastry = require('pastry'),
        template = pastry.template,
    marked = require('marked'),
    utils = require('../utils/middleware'),
        extname = utils.extname,
        readFile = utils.readFile,
        genHTMLRes = utils.genHTMLRes,

    genTemplateRender = function(filename) {
        return template.compile(readFile(join(__dirname, filename)));
    },
    nameByExt = {
        markdown: 'markdown',
        md: 'markdown'
    },
    templateByName = {
        markdown: genTemplateRender('../template/file-markdown.html')
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
                    genHTMLRes(
                        templateByName.markdown({
                            options: options,
                            title: relative(options.root, pathname),
                            content: marked(readFile(pathname))
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

