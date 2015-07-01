/* jshint strict: true, undef: true, unused: true */
/* global define, decodeURIComponent, encodeURIComponent */

define('pastry/url/querystring', [
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-11-19
     * @description : querystring 模块
     * @note        : browsers only
     */
    var escape = encodeURIComponent,

        unescape = function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        },

        querystring = {
            /*
             * @description : override default encoding method
             * @syntax      : querystring.escape(str)
             * @param       : {String} str, unescaped string.
             * @return      : {String} escaped string.
             */
            escape: escape,

            /*
             * @description : override default decoding method
             * @syntax      : querystring.unescape(str)
             * @param       : {String} str, escaped string.
             * @return      : {String} unescaped string.
             */
            unescape: unescape,

            parse: function (qs, sep, eq) {
                /*
                 * @description : accept query strings and return native javascript objects.
                 * @syntax      : querystring.parse(str)
                 * @param       : {String} str, query string to be parsed.
                 * @return      : {Object} parsed object.
                 */
                sep = sep || '&';
                eq  = eq  || '=';
                var tuple,
                    obj    = {},
                    pieces = qs.split(sep);

                pastry.each(pieces, function (elem) {
                    tuple = elem.split(eq);
                    if (tuple.length > 0) {
                        obj[unescape(tuple.shift())] = unescape(tuple.join(eq));
                    }
                });
                return obj;
            },
            stringify: function (obj, c) {
                /*
                 * @description : converts an arbitrary value to a query string representation.
                 * @syntax      : querystring.stringify(obj)
                 * @param       : {object} obj, object to be stringified
                 * @return      : {String} query string.
                 */
                var qs = [],
                    s  = c && c.arrayKey ? true : false;

                pastry.each(obj, function (value, key) {
                    if (pastry.isArray(value)) {
                        pastry.each(value, function (elem) {
                            qs.push(escape(s ? key + '[]' : key) + '=' + escape(elem));
                        });
                    }
                    else {
                        qs.push(escape(key) + '=' + escape(value));
                    }
                });
                return qs.join('&');
            }
        };

    return querystring;
});

