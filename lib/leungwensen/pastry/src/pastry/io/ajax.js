/* jshint strict: true, undef: true, unused: true */
/* global define, XMLHttpRequest, ActiveXObject, location */

define('pastry/io/ajax', [
    'pastry/pastry',
    'pastry/bom/utils',
    'pastry/encoding/json',
    'pastry/url/querystring'
], function (
    pastry,
    bomUtils,
    json,
    querystring
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-11-19
     * @description : io 模块 - ajax
     * @note        : browser only
     */

    function getXHR () {
        return pastry.getAny(
            function () { return new XMLHttpRequest(); },
            function () { return new ActiveXObject('MSXML2.XMLHTTP'); },
            function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
        );
    }

    var noCacheCounter = 0,
        hasSubString = pastry.hasSubString,
        ajax = function (uri, option) {
        /*
         * @description : ajax.
         * @syntax      : [pastry.]ajax(uri[, option])[.error(callback)][.success(callback)]..
         * @param       : {String} uri, uri.
         * @param       : {Object} option, option.
         * @return      : {this  } return itself for chain operations.
         */
        option = option || {};
        var xhr = getXHR(),
            method = option.method ? pastry.uc(option.method) : 'GET',
            type = option.type ? pastry.lc(option.type) : 'xml',
            data = option.data ? querystring.stringify(option.data) : null,
            contentType = option.contentType,
            isAsync = true, // https://xhr.spec.whatwg.org/ 不设置成 true，新版 chrome 会发飙
            username = option.username,
            password = option.password;

        // response type {
            if ('responseType' in xhr && option.responseType) {
                xhr.responseType = option.responseType; // like 'arraybuffer'
            }
        // }

        // add handlers {
            pastry.each([
                'abort',
                'error',
                'load',
                'loadend',
                'loadstart',
                'progress',
                'success',
                'timeout'
            ], function (handler) {
                /*
                 * @description : event handlers.
                 * @param       : {Function} callback, callback function.
                 */
                if (option[handler]) {
                    xhr['on' + handler] = option[handler];
                }
            });
        // }
        // success / error callback {
            xhr.isSuccess = function () {
                /*
                 * @description : is ajax request success
                 * @syntax      : pastry.ajax.isSuccess()
                 * @return      : {Boolean} is ajax request successfully porformed
                 */
                var status = xhr.status;
                return (status >= 200 && status < 300) ||
                       (status === 304) ||
                       (!status && location.protocol === 'file:') ||
                       (!status && bomUtils.versions.safari);
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.isSuccess()) {
                        if (option.success) {
                            var response = xhr.response || xhr.responseText;
                            if (type === 'json') {
                                response = pastry.getAny(
                                    function () { return json.parse(response); }
                                ) || response;
                            }
                            xhr.onsuccess(response);
                        }
                    } else if (option.error) {
                        xhr.onerror(xhr.statusText);
                    }
                }
            };
        // }
        // progress ajax {
            if (method === 'GET') {
                if (option.noCache) {
                    uri += (
                        (hasSubString(uri, '?') ? '&' : '?') +
                        '_PASTRY_NO_CACHE_=' + (noCacheCounter ++)
                    );
                }
                if (data) {
                    uri += (hasSubString(uri, '?') ? '&' : '?') + data;
                }
                xhr.open(method, uri, isAsync, username, password);
                xhr.setRequestHeader(
                    'Content-Type',
                    contentType || 'text/plain;charset=UTF-8'
                );
            } else if (method === 'POST') {
                xhr.open(method, uri, isAsync, username, password);
                xhr.setRequestHeader(
                    'Content-Type',
                    contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
                );
            } else {
                xhr.open(method, uri, isAsync, username, password);
            }
            xhr.send(data);
        // }
    };

    return pastry.ajax = ajax;
});

