/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(title, rc, pathInfo) {
        __p += '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta http-equiv="Content-Type" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>\n  <title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title>\n  <link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/explorer.css">\n</head>\n<body>\n<div id="loading">\n  <div class="sk-double-bounce">\n    <div class="sk-child sk-double-bounce1"></div>\n    <div class="sk-child sk-double-bounce2"></div>\n  </div>\n</div>\n<script>\n  var GLOBAL_VARIABLES = {\n    pathInfo: ' +
            ((__t = (JSON.stringify(pathInfo))) == null ? '' : __t) +
            ',\n    rc: ' +
            ((__t = (JSON.stringify(rc))) == null ? '' : __t) +
            ',\n  };\n</script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/jquery.min.js"></script>\n<script src="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/zfinder/explorer.js"></script>\n</body>\n</html>\n';;
        return __p;
    })(data.title, data.rc, data.pathInfo);
};