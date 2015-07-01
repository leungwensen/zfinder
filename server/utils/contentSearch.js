/* jshint strict: false, undef: true, unused: true */
/* global require, module, process */

var fs = require('fs'),
    path = require('path'),
        join = path.join,
        relative = path.relative,
    pastry = require('pastry'),
        some = pastry.some,
        each = pastry.each,
        getAny = pastry.getAny,
        map = pastry.map,
    utils = require('./middleware'),
        isBinaryPath = utils.isBinaryPath,
        processFile = utils.processFile,
        readFile = utils.readFile;

module.exports = function(query, options, callback) {
    var root = options.root || process.cwd(),
        re = new RegExp(
            // escape regexp characters
            // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
            '(' + query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')',
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
            each(files, function(filename) {
                if (filename[0] !== '.') { // 去掉隐藏文件
                    walk(join(path, filename), root);
                }
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
    fs.stat(root, function(err) {
        if (err) {
            callback(err);
        }
        walk(root, root);
        callback(null, result);
    });
};
