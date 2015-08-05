/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/geo/Rect', [
    'pastry/pastry',
    'pastry/declare'
], function(
    pastry,
    declare
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var extend = pastry.extend;

    var max = Math.max,
        min = Math.min;

    var Rect = declare({
        constructor: function(box) {
            /*
             * left, top, width, height
             */
            extend(this, box);
        },
        containRect: function(rect) {
            var me = this;
            return me.top <= rect.top &&
                me.left <= rect.left &&
                me.height + me.top >= rect.height + rect.top &&
                me.width + me.left >= rect.width + rect.left;
        },
        containPoint: function(point) {
            var me = this;
            return me.top <= point.x &&
                me.left <= point.y &&
                me.height + me.top >= point.y &&
                me.width + me.left >= point.x;
        },
        intersectRect: function(rect) {
            var me = this;
            var x1 = max(me.left, rect.left),
                y1 = max(me.top, rect.top);
            var x2 = min(me.left + me.width, rect.left + rect.width),
                y2 = min(me.top + me.height, rect.top + rect.height);
            return x1 <= x2 && y1 <= y2;
        },
        clone: function() {
            return new Rect(this);
        }
    });
    return Rect;
});

