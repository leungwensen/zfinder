/* jshint strict: true, undef: true, unused: true */
/* global define, mermaid */

define([
    'pastry/pastry',
    'pastry/dom/query',
    '../component/drawFlowcharts',
    '../component/marked',
    '../component/Resizer'
], function(
    pastry,
    domQuery,
    drawFlowcharts,
    marked,
    Resizer
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var container = domQuery.one('article.markdown-container'),
        previewerDomNode = domQuery.one('section#markdown-previewer'),
        content = domQuery.one('script#markdown-content').innerHTML;

    previewerDomNode.innerHTML = marked(content);
    mermaid.init(); // render graphs
    drawFlowcharts(previewerDomNode);

    new Resizer(container, {
        directions: ['e', 'w'],
        minWidth: 400,
        maxWidth: 1400,
        onResize: function() {
        }
    });
});

