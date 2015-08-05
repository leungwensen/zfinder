/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/geo/Point', [
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
    return declare({
        constructor: function(x, y) {
            this.x = x;
            this.y = y;
        }
    });
});

