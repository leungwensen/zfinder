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
            '</title>\n<link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/normalize-4.2.0.min.css">\n\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/github-markdown-2.3.0.min.css">\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/katex-0.7.1/katex.min.css">\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/markdown-previewer.css">\n</head>\n<body>\n\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"\n     style="width:0;height:0;position:absolute;overflow:hidden;">\n  <defs>\n    <symbol id="si-zfinder-collapse-left" viewBox="0 0 38 38">\n      <path d="M38 0H0v38h38V0zM3 35V3h32v32H3zM5 5v28h17V21h-9.667L16 26h-4l-5-7 5-7h4l-3.667 5H22V5H5z"/>\n    </symbol>\n    <symbol id="si-zfinder-expand-right" viewBox="0 0 38 38">\n      <path d="M0 0h38v38H0V0zm35 35V3H3v32h32zM22 5v28H5V21h9.667L11 26h4l5-7-5-7h-4l3.667 5H5V5h17z"/>\n    </symbol>\n    <symbol id="si-zfinder-fullscreen" viewBox="0 0 28 28">\n      <path d="M4 18H0v10h10v-4H4v-6zm-4-8h4V4h6V0H0v10zm24 14h-6v4h10V18h-4v6zM18 0v4h6v6h4V0H18z"/>\n    </symbol>\n    <symbol id="si-zfinder-fullscreen-exit" viewBox="0 0 28 28">\n      <path d="M0 22h6v6h4V18H0v4zM6 6H0v4h10V0H6v6zm12 22h4v-6h6v-4H18v10zm4-22V0h-4v10h10V6h-6z"/>\n    </symbol>\n  </defs>\n</svg>\n<nav id="toc">\n  <div id="toc-body" class="toc-body"></div>\n</nav>\n<article id="markdown">\n  <nav id="markdown-header" class="markdown-header">\n    <svg class="si" id="toggle-toc" width="24" height="24">\n      <use xlink:href="#si-zfinder-collapse-left"></use>\n    </svg>\n    <svg class="si float-right" id="toggle-fullscreen-article" width="24" height="24">\n      <use xlink:href="#si-zfinder-fullscreen"></use>\n    </svg>\n  </nav>\n  <div id="markdown-body" class="markdown-body">' +
            ((__t = (body)) == null ? '' : __t) +
            '</div>\n</article>\n<div id="loading">\n  <div class="sk-double-bounce">\n    <div class="sk-child sk-double-bounce1"></div>\n    <div class="sk-child sk-double-bounce2"></div>\n  </div>\n</div>\n\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/jquery-3.1.0.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/screenfull-3.0.0.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/markdown-previewer.js"></script>\n</body>\n</html>\n';;
        return __p;
    })(data.title, data.rc, data.body);
};