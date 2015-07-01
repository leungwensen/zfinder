/* jshint strict: true, undef: true, unused: true */
/* global define, window, moment, filesize */

define([
    'pastry/pastry',
    'pastry/dom/query',
    'pastry/ui/Tree',
    '../global/CONST',
    '../cgi/directory',
    './iconByExtname'
], function(
    pastry,
    domQuery,
    Tree,
    CONST,
    directoryCgi,
    iconByExtname
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var map = pastry.map,
        lc = pastry.lc,

        domNode = domQuery.one('#ls'),

        processNode = function(node) {
            node.mtimeReadable = node.mtime ? moment(node.mtime).fromNow() : '';
            node.sizeReadable = node.isBranch ? '--' : node.size ? filesize(node.size) : '';
            return node;
        },

        ls = {
            init: function() {
                ls.domNode = domNode;
                ls.tree = new Tree({
                    hasHead: true,
                    hasIcon: true,
                    hasExpanderIcon: false,
                    treeColumnName: 'name',
                    //data: data,
                    onExpand: function(node) {
                        directoryCgi
                            .ls(node.id)
                            .then(function(data) {
                                var nodes = map(data, function(n) {
                                    n.parentId = node.id;
                                    return processNode(n);
                                });
                                ls.tree.addNodes(nodes);
                            });
                    },
                    onDblclick: function(node) {
                        if (node.isBranch || node.name === '..') {
                            window.location.href = '/' + node.relativePathname;
                        } else {
                            window.open('/' + node.relativePathname, '_blank');
                        }
                    },
                    getIconClass: function(node) {
                        if (node.name === '..') {
                            return 'fa fa-folder';
                        }
                        if (node.isBranch) {
                            return node.isExpanded ? 'fa fa-folder-open' : 'fa fa-folder';
                        } else {
                            return iconByExtname[lc(node.extname)] || 'fa fa-file-text-o';
                        }
                    },
                    extraColumns: [{
                        label: 'Date Modified',
                        key: 'mtimeReadable'
                    }, {
                        label: 'Size',
                        key: 'sizeReadable'
                    }]
                }).placeAt(domNode);
                directoryCgi
                    .ls(CONST.path)
                    .then(function(data) {
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

