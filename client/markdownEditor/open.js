/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/ui/Tree',
    '../cgi/api',
    '../component/Modal',
    '../global/CONST',
    '../global/utils',
    '../template/open'
], function(
    pastry,
    domConstruct,
    domEvent,
    domQuery,
    Tree,
    api,
    Modal,
    CONST,
    utils,
    tmplOpen
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map,
        openCallback = function(){},
        processNode = utils.processNode,
        openDialog = new Modal({
            title: 'open',
            classname: 'open-dialog',
            width: '480px',
        }),
        openDialogDomNode = openDialog.domNode,
        openPathDomNode,
        openFilename;
    // initialize {
        domConstruct.place(tmplOpen(), openDialog.domNode);
        openPathDomNode = domQuery.one('#open-path');
        // file tree {
            openDialog.tree = new Tree({
                hasIcon: true,
                hasExpanderIcon: false,
                onExpand: function(node) {
                    api.ls(node.id, 'directory,markdown').then(function(data) {
                        var nodes = map(data, function(n) {
                            n.parentId = node.id;
                            return processNode(n);
                        });
                        openDialog.tree.addNodes(nodes);
                    });
                },
                onCollapse: function(node) {
                    node.removeChildren();
                },
                onSelect: function(node) {
                    if (node.isLeaf) {
                        openFilename = node.relativePathname;
                    } else {
                        openFilename = '';
                    }
                },
                onDblclick: function(node) {
                    if (node.isLeaf) {
                        openCallback(node.relativePathname);
                        openDialog.hide();
                    } else {
                        node.expand();
                    }
                },
                getIconClass: utils.getIconClass,
            }).placeAt(openPathDomNode);
            openDialog.tree.addNode(processNode({
                id: CONST.root,
                fullPathname: CONST.root,
                isBranch: true,
                name: CONST.root,
                relativePathname: '.'
            }));
            api.ls(CONST.path, 'directory,markdown').then(function(data) {
                openDialog.tree.addNodes(map(data, function(node) {
                    node.parentId = CONST.root;
                    return processNode(node);
                }));
            });
        // }
    // }
    // dom events {
        domEvent.on(openDialogDomNode, 'click', '.confirm-open', function() {
            if (!!openFilename) {
                openCallback(openFilename);
                openDialog.hide();
            }
        });
        domEvent.on(openDialogDomNode, 'click', '.cancel-open', function() {
            openDialog.hide();
        });
    // }
    return function(callback) {
        openCallback = callback;
        openDialog.show();
    };
});

