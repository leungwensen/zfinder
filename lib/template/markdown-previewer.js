module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(title, rc, body) {
        __p += '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta http-equiv="Content-Type" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>\n  <title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title>\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/github-markdown.css">\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/markdown-previewer.css">\n</head>\n<body>\n<nav id="toc"></nav>\n<article id="markdown-body" class="markdown-body">' +
            ((__t = (body)) == null ? '' : __t) +
            '</article>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/jquery.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/markdown-previewer.js"></script>\n</body>\n</html>\n';;
        return __p;
    })(data.title, data.rc, data.body);
};