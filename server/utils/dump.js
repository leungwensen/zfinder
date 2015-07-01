/* jshint strict: false, undef: true, unused: true */
/* global module, console */

module.exports = function(data) {
    try {
        console.log(JSON.stringify(data, '\r\n', 4));
    } catch(e) {
        console.log(e);
    }
};
