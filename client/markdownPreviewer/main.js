/* jshint strict: true, undef: true, unused: true */
/* global define, mermaid */

define([
    'pastry/pastry',
    'pastry/dom/query',
    '../component/drawFlowcharts',
    '../component/marked'
], function(
    pastry,
    domQuery,
    drawFlowcharts,
    marked
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var previewerDomNode = domQuery.one('section#markdown-previewer'),
        content = domQuery.one('script#markdown-content').innerHTML;

    previewerDomNode.innerHTML = marked(content);
    mermaid.init(); // render graphs
    drawFlowcharts(previewerDomNode);
});

