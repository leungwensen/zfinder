/* jshint strict: true, undef: true, unused: true */
/* global define, fetch */

define('pastry/io/fetch', [
    'pastry/pastry',
    'pastry/io/ajax',
    'pastry/promise/Promise'
], function(
    pastry,
    ajax,
    Promise
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : fetch shim
     */
    function exportFetch(obj) {
        pastry.setGLOBAL('fetch', obj);
        return obj;
    }

    var isFunction = pastry.isFunction;

    // 注释掉这一段来测试shim代码 {
        if (
            typeof fetch !== 'undefined' && fetch &&
            isFunction(fetch)
        ) {
            return exportFetch(fetch);
        }
    // }

    return exportFetch(function(url, option) {
        return new Promise(function(resolve, reject) {
            var originOnSuccess = option.success,
                originOnError   = option.error;
            ajax(url, pastry.extend({}, option, {
                success: function(res) {
                    if (isFunction(originOnSuccess)) {
                        originOnSuccess(res);
                    }
                    resolve(res);
                },
                error: function(err) {
                    if (isFunction(originOnError)) {
                        originOnError(err);
                    }
                    reject(err);
                }
            }));
        });
    });
});

