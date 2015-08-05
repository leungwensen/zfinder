/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/geo', [
    'pastry/pastry',
    'pastry/geo/Rect'
], function(
    pastry,
    Rect
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var each = pastry.each;

    var rect, targetRect;

    var geo = {
        bbox: function(domNode) {
            var clientRect = domNode.getBoundingClientRect();
            var plainObj = {};
            each([
                'bottom',
                'height',
                'left',
                'right',
                'top',
                'width'
            ], function (key) {
                plainObj[key] = clientRect[key];
            });
            return plainObj;
        },
        contain: function(domNode, target) {
            rect = new Rect(geo.bbox(domNode));
            targetRect = new Rect(geo.bbox(target));
            return rect.containRect(targetRect);
        },
        intersect: function(domNode, target) {
            rect = new Rect(geo.bbox(domNode));
            targetRect = new Rect(geo.bbox(target));
            return rect.intersectRect(targetRect);
        },
    };
    return geo;
});

