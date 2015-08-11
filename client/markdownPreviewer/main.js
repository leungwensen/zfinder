/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/hotkey',
    'pastry/dom/query',
    'pastry/io/ajax',
    '../global/CONST',
    '../component/Modal',
    '../component/Resizer',
    '../component/markedRenderer'
    //'../component/remarkableRenderer'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domHotkey,
    domQuery,
    ajax,
    CONST,
    Modal,
    Resizer,
    markdownRenderer
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    // preview {
        var previewerDomNode = domQuery.one('#markdown-previewer');
        var content = domQuery.one('script#markdown-content').innerHTML;
        markdownRenderer(previewerDomNode, content);
    // }
    // resizer {
        var container = domQuery.one('.markdown-container');
        new Resizer(container, {
            directions: ['e', 'w'],
            minWidth: 400,
            maxWidth: 1400,
            onResize: function() {
            }
        });
    // }
});

