/* jshint strict: false, undef: true, unused: true */
/* global require, module, Buffer */

var touch = require('touch'),
    fs = require('fs'),
        readFile = function(filename) {
            return fs.readFileSync(filename, {
                encoding: 'utf8'
            });
        },
        writeFile = function(filename, content) {
            touch.sync(filename);
            fs.writeFileSync(filename, content);
        },
    pastry = require('pastry'),
        each = pastry.each,
        extend = pastry.extend,
        filter = pastry.filter,
        json = pastry.json,
        lc = pastry.lc,
        template = pastry.template,
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
    writeFile: writeFile,
    decodeUriStr: function(str) {
        str = str || '';
        return decodeURIComponent(str).replace(/\+/g, ' ');
    },
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
    genTemplateRender: function(filename) {
        return template.compile(readFile(filename));
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

