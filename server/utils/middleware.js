/* jshint strict: false, undef: true, unused: true */
/* global require, module, Buffer */

var fs = require('fs'),
    readFile = function(filename) {
        return fs.readFileSync(filename, {
            encoding: 'utf8'
        });
    },
    pastry = require('pastry'),
        each = pastry.each,
        extend = pastry.extend,
        filter = pastry.filter,
        json = pastry.json,
        lc = pastry.lc,
    path = require('path'),
        join = path.join,
        relative = path.relative,
        extname = function(filename) {
            return lc(path.extname(filename).substr(1));
        },
    binaryExtnames = require('./binaryExtnames.json'),
    binaryExts = Object.create(null);

each(binaryExtnames, function(ext) {
    binaryExts[ext] = true;
});

module.exports = {
    extname: extname,
    readFile: readFile,
    removeHidden: function(files) {
        return filter(files, function(file){
            return '.' != file[0];
        });
    },
    isBinaryPath: function(filepath) {
        return extname(filepath) in binaryExts;
    },
    genJSONRes: function(data, res) {
        var body = json.stringify(data),
            buf = new Buffer(body, 'utf8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
    },
    genHTMLRes: function(data, res) {
        var buf = new Buffer(data);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
    },
    processFile: function(currentPath, root, filename) {
        var filePath = join(currentPath, filename),
            stats = fs.statSync(filePath);
        return extend({}, stats, {
            id: filePath,
            fullPathname: filePath,
            relativePathname: relative(root, filePath),
            isExpanded: false,
            isBranch: stats.isDirectory(),
            name: filename,
            extname: extname(filePath),
        });
    }
};

