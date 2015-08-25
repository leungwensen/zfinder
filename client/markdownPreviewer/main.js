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
                domStyle.hide(headerNode);
                domStyle.hide(treeHolderNode);
                domStyle.set(tocNode, 'width', '0');
                isShown = false;
            }
            function showToc() {
                domClass.remove(hideOrShowIcon, 'fa-angle-left');
                domClass.add(hideOrShowIcon, 'fa-angle-right');
                domStyle.show(headerNode);
                domStyle.show(treeHolderNode);
                domStyle.set(tocNode, 'width', '160px');
                isShown = true;
            }

            toc(articleNode, treeHolderNode, 3);

            new Resizer(tocNode, {
                directions: ['w'],
                minWidth: 140,
                maxWidth: 1400,
            });
            new Resizer(treeHolderNode, {
                directions: ['s'],
            });

            domEvent.on(hideOrShowBtn, 'click', function() {
                if (isShown) {
                    hideToc();
                } else {
                    showToc();
                }
            });
            hideToc(); // hide by default
        }, 300);
    // }
});

