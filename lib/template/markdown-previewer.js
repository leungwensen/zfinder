/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(title, rc, body) {
        __p += '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n<meta http-equiv="Content-Type" name="viewport" content="width=device-width, initial-scale=1"/>\n<title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title>\n\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/github-markdown-2.3.0.min.css">\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/markdown-previewer.css">\n</head>\n<body>\n<nav id="toc">\n  <div id="toc-body" class="toc-body"></div>\n</nav>\n<article id="markdown">\n  <div id="markdown-body" class="markdown-body">' +
            ((__t = (body)) == null ? '' : __t) +
            '</div>\n</article>\n<div id="loading">\n  <div class="sk-double-bounce">\n    <div class="sk-child sk-double-bounce1"></div>\n    <div class="sk-child sk-double-bounce2"></div>\n  </div>\n</div>\n\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/jquery-3.1.0.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/markdown-previewer.js"></script>\n</body>\n</html>\n';;
        return __p;
    })(data.title, data.rc, data.body);
};