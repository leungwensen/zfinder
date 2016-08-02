/* eslint-disable */ module.exports = function(data, helper) {
    data = data || {};
    helper = helper || {};
    var __t;
    var __p = '';
    var __j = Array.prototype.join;
    var print = function() {
        __p += __j.call(arguments, '');
    };
    return (function(title) {
        __p += '<meta charset="UTF-8">\n<meta http-equiv="Content-Type" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>\n<title>' +
            ((__t = (title)) == null ? '' : __t) +
            '</title>\n';;
        return __p;
    })(data.title);
};