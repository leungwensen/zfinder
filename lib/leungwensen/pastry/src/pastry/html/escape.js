/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/html/escape', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : utils for html
     */
    var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        },
        unescapeMap = pastry.invert(escapeMap);

    function createEscaper (map) {
        // Regexes for identifying a key that needs to be escaped
        var source        = '(?:' + pastry.keys(map).join('|') + ')',
            testRegexp    = new RegExp(source),
            replaceRegexp = new RegExp(source, 'g');

        function escaper (match) {
            return map[match];
        }

        return function (string) {
            string = string === null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    }

    return {
        escape   : pastry.escape   = createEscaper(escapeMap),
        unescape : pastry.unescape = createEscaper(unescapeMap)
    };
});

