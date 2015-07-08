/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var hasKey = pastry.hasKey,
        store = {};

    return {
        get: function(key, defaultValue) {
            if (hasKey(store, key)) {
                return store[key];
            }
            return defaultValue;
        },
        set: function(key, value) {
            store[key] = value;
        },
        getStore: function() {
            return store;
        }
    };
});

