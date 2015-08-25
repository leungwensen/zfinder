/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/oop/declare'
], function(
    pastry,
    declare
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var hasKey = pastry.hasKey;

    return declare({
        constructor: function() {
            var me = this;
            me.store = {};
        },
        get: function(key, defaultValue) {
            var store = this.store;
            if (hasKey(store, key)) {
                return store[key];
            }
            return defaultValue;
        },
        getStore: function() {
            return this.store;
        },
        set: function(key, value) {
            this.store[key] = value;
        },
        setStore: function(store) {
            this.store = store;
        },
        remove: function(key) {
            delete this.store[key];
        },
        clear: function() {
            this.store = {};
        }
    });
});

