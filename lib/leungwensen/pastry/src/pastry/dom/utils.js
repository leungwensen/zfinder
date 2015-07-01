/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/utils', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : utils for dom operations
     * @note        : browser only
     */
    var doc     = document,
        html    = doc.documentElement,
        testDiv = doc.createElement('div');

    return {
        hasTextContent : 'textContent' in testDiv,
        hasClassList   : 'classList'   in testDiv,
        hasDataSet     : 'dataset'     in testDiv,
        canDnD         : 'draggable'   in testDiv,
        isQuirks       : pastry.lc(doc.compatMode) === 'backcompat' ||
            doc.documentMode === 5, // 怪异模式
        testDiv        : testDiv,

        contains: 'compareDocumentPosition' in html ?
            function (element, container) {
                return (container.compareDocumentPosition(element) & 16) === 16;
            } :
            function (element, container) {
                container = (container === doc || container === window) ?
                    html : container;
                return container !== element &&
                    container.contains(element);
            },

        isDomNode: function (element) {
            var t;
            return element &&
                typeof element === 'object' &&
                (t = element.nodeType) && (t === 1 || t === 9);
        },
    };
});

