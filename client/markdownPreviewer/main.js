/* jshint strict: true, undef: true, unused: true */
/* global define, setTimeout */

define([
    'pastry/pastry',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    '../component/markedRenderer',
    '../component/toc'
], function(
    pastry,
    domEvent,
    domQuery,
    domStyle,
    markdownRenderer,
    toc
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    // preview
    var previewerDomNode = domQuery.one('#markdown-previewer');
    var content = domQuery.one('script#markdown-content').innerHTML;
    var articleNode = domQuery.one('.markdown-container');
    markdownRenderer(previewerDomNode, content);
    // toc
    setTimeout(function() { // optimize markdown rendering
        var tocNode = domQuery.one('#toc');
        var treeHolderNode = domQuery.one('.tree-holder', tocNode);
        var titles = toc(articleNode, treeHolderNode, 6);
        if (!titles) {
            toggleToc(false);
        }
    }, 100);
    var isUndefined = pastry.isUndefined;
    var isTocShown = true;
    var defaultLeft = '240px';
    function toggleToc(isShow) {
        isShow = isUndefined(isShow) ? !isTocShown : isShow;
        domStyle.set(articleNode, 'left', isShow ? defaultLeft : 0);
        isTocShown = isShow;
    }
    domEvent.on('#btn-toggle-toc', 'click', function() {
        toggleToc();
    });
});

