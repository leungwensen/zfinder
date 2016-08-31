/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(title, rc, content, pathInfo) {
        __p += '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n<meta http-equiv="Content-Type" name="viewport" content="width=device-width, initial-scale=1"/>\n<title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title>\n\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/lib/codemirror.css">\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/addon/fold/foldgutter.css"/>\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/text-editor.css">\n</head>\n<body>\n<form id="editor-container"><textarea id="code" name="code">' +
            ((__t = (content)) == null ? '' : __t) +
            '</textarea></form>\n<div id="loading">\n  <div class="sk-double-bounce">\n    <div class="sk-child sk-double-bounce1"></div>\n    <div class="sk-child sk-double-bounce2"></div>\n  </div>\n</div>\n\n<script>\n  var GLOBAL_VARIABLES = {\n    pathInfo: ' +
            ((__t = (JSON.stringify(pathInfo || ''))) == null ? '' : __t) +
            ',\n    rc: ' +
            ((__t = (JSON.stringify(rc || ''))) == null ? '' : __t) +
            ',\n  };\n</script>\n\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/jquery-3.1.0.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/lib/codemirror.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/addon/mode/loadmode.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/mode/meta.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/addon/fold/foldcode.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/addon/fold/foldgutter.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/addon/fold/brace-fold.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/addon/fold/xml-fold.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/codemirror-5.18.2/addon/fold/comment-fold.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/text-editor.js"></script>\n</body>\n</html>\n';;
        return __p;
    })(data.title, data.rc, data.content, data.pathInfo);
};