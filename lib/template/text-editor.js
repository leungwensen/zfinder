/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(rc, content) {
        __p += '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <import src="./partial/common-header.html"></import>\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror/lib/codemirror.css">\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/text-editor.css">\n</head>\n<body>\n<form id="editor-container">\n  <textarea id="code" name="code">' +
            ((__t = (content)) == null ? '' : __t) +
            '</textarea>\n</form>\n<import src="./partial/loading.html"></import>\n<import src="./partial/global-variables.html"></import>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/jquery.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror/lib/codemirror.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror/addon/mode/loadmode.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror/mode/meta.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/text-editor.js"></script>\n</body>\n</html>\n';;
        return __p;
    })(data.rc, data.content);
};