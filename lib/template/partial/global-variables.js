/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};

    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };

    return (function(pathInfo, rc) {
        __p += '<script>\n  var GLOBAL_VARIABLES = {\n    pathInfo: ' +
            ((__t = (JSON.stringify(pathInfo || ''))) == null ? '' : __t) +
            ',\n    rc: ' +
            ((__t = (JSON.stringify(rc || ''))) == null ? '' : __t) +
            ',\n  };\n</script>\n';;
        return __p;
    })(data.pathInfo, data.rc);
};