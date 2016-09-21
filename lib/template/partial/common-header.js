/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};

    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };

    return (function(title, rc) {
        __p += '<meta charset="UTF-8">\n<meta http-equiv="Content-Type" name="viewport" content="width=device-width, initial-scale=1"/>\n<title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title>\n<link rel="stylesheet" href="' +
            ((__t = (rc.assetsServer)) == null ? '' : __t) +
            '/dist/lib/normalize-4.2.0.min.css">\n';;
        return __p;
    })(data.title, data.rc);
};