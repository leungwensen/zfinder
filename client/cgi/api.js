/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/io/ajax',
    'pastry/promise/Promise',
    '../global/CONST'
], function(
    pastry,
    ajax,
    Promise,
    CONST
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var isFunction = pastry.isFunction;

    function getApiUrl(path) {
        return CONST.apiRoot + path;
    }
    function buildApiFetch(method, path, data) {
        var option = {
            type: 'json',
            method: method,
            data: data
        };
        return new Promise(function(resolve, reject) {
            var originOnSuccess = option.success,
                originOnError   = option.error;
            ajax(getApiUrl(path), pastry.extend({}, option, {
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
    }

    return {
        ls: function(path, type) {
            path = path || CONST.root;
            return buildApiFetch('GET', '/ls', {
                path: path,
                type: type
            });
        },
        globSearch: function(query) {
            return buildApiFetch('GET', '/search/glob', {
                query: query
            }).then(function(data) {
                return data.glob;
            });
        },
        contentSearch: function(query) {
            return buildApiFetch('GET', '/search/content', {
                query: query
            }).then(function(data) {
                return data.content;
            });
        },
    };
});

