/* jshint strict: true, undef: true, unused: true */
/* global define, setTimeout */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/hotkey',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/io/ajax',
    '../global/CONST',
    '../global/utils',
    '../component/Modal',
    '../component/Resizer',
    '../component/markedRenderer',
    '../component/toc'
    //'../component/remarkableRenderer'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domHotkey,
    domQuery,
    domStyle,
    ajax,
    CONST,
    utils,
    Modal,
    Resizer,
    markdownRenderer,
    toc
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
        var articleNode = domQuery.one('.markdown-container');
        new Resizer(articleNode, {
            directions: ['e', 'w'],
            minWidth: 400,
            maxWidth: 1400
        });
    // }
    // toc {
        setTimeout(function() { // optimize markdown rendering
            var tocNode = domQuery.one('#toc');
            var hideOrShowBtn = domQuery.one('#hide-or-show-toc');
            var hideOrShowIcon = domQuery.one('.fa', hideOrShowBtn);
            var headerNode = domQuery.one('header', tocNode);
            var treeHolderNode = domQuery.one('.tree-holder', tocNode);
            var isShown = true;
            function hideToc() {
                domClass.remove(hideOrShowIcon, 'fa-angle-right');
                domClass.add(hideOrShowIcon, 'fa-angle-left');
                domStyle.set(hideOrShowBtn, 'left', '-20px');
                domStyle.hide(headerNode);
                domStyle.hide(treeHolderNode);
                domStyle.set(tocNode, 'width', '0');
                isShown = false;
            }
            function showToc() {
                domClass.remove(hideOrShowIcon, 'fa-angle-left');
                domClass.add(hideOrShowIcon, 'fa-angle-right');
                domStyle.set(hideOrShowBtn, 'left', '-1px');
                domStyle.show(headerNode);
                domStyle.set(tocNode, 'width', '200px');
                domStyle.show(treeHolderNode);
                domStyle.set(treeHolderNode, 'max-height', (utils.getWindowSize().height - 75) + 'px');
                isShown = true;
            }

            var titles = toc(articleNode, treeHolderNode, 6);
            if (titles) {
                showToc();
            } else {
                hideToc(); // hide if no headers
            }

            new Resizer(tocNode, {
                directions: ['w'],
                minWidth: 170,
                maxWidth: 1400,
            });

            domEvent.on(hideOrShowBtn, 'click', function() {
                if (isShown) {
                    hideToc();
                } else {
                    showToc();
                }
            });
        }, 300);
    // }
});

