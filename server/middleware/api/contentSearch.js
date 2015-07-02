/* jshint strict: true, undef: true, unused: true */
/* global require, module */

var fs = require('fs'),
    path = require('path'),
        join = path.join,
        relative = path.relative,
    url = require('url'),
        urlParse = url.parse,
    pastry = require('pastry'),
        some = pastry.some,
        each = pastry.each,
        getAny = pastry.getAny,
        map = pastry.map,
    utils = require('../../utils/middleware'),
        genJSONRes = utils.genJSONRes,
        isBinaryPath = utils.isBinaryPath,
        removeHidden = utils.removeHidden,
        processFile = utils.processFile,
        readFile = utils.readFile;

module.exports = function(req, res, next, options) {
    'use strict';

    var urlInfo = urlParse(req.url, true),
        query = urlInfo.query,
        root = options.root,
        re = new RegExp(
            // escape regexp characters
            // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
            '(' + query.query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')',
            'i'
        ),
        result = [];

    function walk(path, root) {
        var stat = getAny(function() {
            return fs.statSync(path);
        });
        if (!stat) {
            return;
        }
        if (stat.isDirectory()) {
            var files = fs.readdirSync(path);
            if (!query.hidden) {
                files = removeHidden(files);
            }
            each(files, function(filename) {
                walk(join(path, filename), root);
            });
        } else if (stat.isFile()) {
            // 先取消搜索二进制文件、大文件
            if (isBinaryPath(path) || stat.size > 1024000) {
                return;
            }
            var str = readFile(path),
                lines = [],
                fileObj,
                matchCounter = 0;
            some(str.split('\n'), function(line, i) {
                if (re.test(line)) {
                    matchCounter ++;
                    lines.push([i+1, line]);
                }
                if (matchCounter === 3) { // 只搜3行
                    return true;
                }
            });
            if (lines.length) {
                fileObj = processFile(root, root, relative(root, path));
                fileObj.matchedLines = map(lines, function(l) {
                    var lineNum = l[0],
                        lineStr = l[1];
                    if (lineStr.length > 200 || /<\w+/.test(lineStr)) {
                        lineStr = '...'+ query +'...';
                    }
                    lineStr = lineStr.replace(re, '<span class="highlight">$1</span>');
                    return [lineNum, lineStr];
                });
                result.push(fileObj);
            }
        }
    }

    if (req.method === 'GET') {
        fs.stat(root, function(err) {
            if (err) {
                genJSONRes({
                    content: []
                }, res);
            }
            walk(root, root);
            genJSONRes({
                content: result
            }, res);
        });
    }
};

