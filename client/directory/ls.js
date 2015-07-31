/* jshint strict: true, undef: true, unused: true */
/* global define, window */

define([
    'pastry/pastry',
    'pastry/dom/query',
    'pastry/ui/Tree',
    '../global/CONST',
    '../global/utils',
    '../cgi/api'
], function(
    pastry,
    domQuery,
    Tree,
    CONST,
    utils,
    api
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map,
        processNode = utils.processNode,
        domNode = domQuery.one('#ls'),
        ls = {
            init: function() {
                ls.domNode = domNode;
                ls.tree = new Tree({
                    hasHead: true,
                    hasIcon: true,
                    hasExpanderIcon: false,
                    treeColumnName: CONST.path,
                    onExpand: function(node) {
                        api.ls(node.id).then(function(data) {
                            var nodes = map(data, function(n) {
                                n.parentId = node.id;
                                return processNode(n);
                            });
                            ls.tree.addNodes(nodes);
                        });
                    },
                    onCollapse: function(node) {
                        node.removeChildren();
                    },
                    onDblclick: function(node) {
                        if (node.isBranch || node.name === '..') {
                            window.location.href = '/' + node.relativePathname;
                        } else {
                            window.open('/' + node.relativePathname, '_blank');
                        }
                    },
                    getIconClass: utils.getIconClass,
                    extraColumns: [{
                        label: 'Date Modified',
                        key: 'mtimeReadable'
                    }, {
                        label: 'Size',
                        key: 'sizeReadable'
                    }]
                }).placeAt(domNode);
                api.ls(CONST.path).then(function(data) {
                    ls.tree.addNodes(map(data, function(node) {
                        return processNode(node);
                    }));
                    // upper dir {
                        if (window.location.pathname !== '/') {
                            ls.tree.addNode(processNode({
                                id: CONST.path + '..',
                                fullPathname: CONST.path + '..',
                                isBranch: false,
                                name: '..',
                                relativePathname: '..'
                            }));
                        }
                    // }
                });
            }
        };

    return ls.init();
});

