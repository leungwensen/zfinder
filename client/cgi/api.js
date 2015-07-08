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
        getApiUrl: getApiUrl,
        buildApiFetch: buildApiFetch,
        ls: function(path, filter) {
            path = path || CONST.root;
            filter = filter || '';
            return buildApiFetch('GET', '/ls', {
                path: path,
                filter: filter,
            });
        },
        getFile: function(path) {
            return buildApiFetch('GET', '/file', {
                path: path
            });
        },
        saveFile: function(path, content) {
            content = content || '';
            return buildApiFetch('POST', '/file', {
                path: path,
                content: content
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

