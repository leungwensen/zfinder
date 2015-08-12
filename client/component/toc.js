/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define([
    'pastry/pastry',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/fmt/sprintf',
    'pastry/ui/Tree',
    '../template/tocAnchor'
], function(
    pastry,
    domConstruct,
    domQuery,
    sprintf,
    Tree,
    tmplTocAnchor
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var each = pastry.each;
    //var lc = pastry.lc;
    //var map = pastry.map;
    var toInt = pastry.toInt;
    var uuid = pastry.uuid;

    var tocTree = new Tree({
        onClick: function(node) {
            scrollToNode(node);
        },
        //onDblclick: function(node) {
            //scrollToNode(node);
        //}
    });

    function scrollToNode(node) {
        var anchorSelector = sprintf('[data-hash="%s"]', node.id);
        var anchorNode = domQuery.one(anchorSelector);
        if (anchorNode) {
            anchorNode.scrollIntoView(true);
        }
    }
    function getHeaderId(/*header*/) {
        //var idSeperater = '-';
        //var text = getHeaderText(header);
        //text = lc(text).replace(/\s/g, idSeperater)
            //.replace(/--/g, idSeperater)
            //.replace(/:-/g, idSeperater);
        //if (tocTree.nodeById[text]) {
            //text = uuid(text + idSeperater);
        //}
        //return text;
        return uuid();
    }
    function getHeaderLevel(header) {
        var tagName = header.tagName;
        return toInt(tagName.replace(/h/i, ''));
    }
    function getHeaderText(header) {
        return header.textContent || header.innerText || header.innerHTML;
    }
    function getHeaderSelector(level) {
        var headers = [];
        for (var i = 1; i <= level; i ++) {
            headers.push(sprintf('h%d', i));
        }
        return headers.join(',');
    }

    return function (article, container, maxLevel) {
        container = container || document.body;
        article = article || document.body;
        maxLevel = maxLevel || 3;
        var headers = article.querySelectorAll(getHeaderSelector(maxLevel));
        var currentNode;
        var nodeMetas = [];
        var nodeMetaById = {};

        each(headers, function(header) {
            var id = getHeaderId(/*header*/);

            var anchorNode = domConstruct.toDom(tmplTocAnchor({
                hash: id
            }));
            domConstruct.place(anchorNode, header, 'before');

            var level = getHeaderLevel(header);
            var meta = {
                id: id,
                isBranch: true,
                //isExpanded: false,
                name: getHeaderText(header),
                level: level,
                childIds: [],
            };
            if (currentNode) {
                if (currentNode.level < level) {
                    meta.parentId = currentNode.id;
                    currentNode.childIds.push(meta.id);
                } else {
                    var parentNode = nodeMetaById[currentNode.parentId];
                    while (parentNode) {
                        if (parentNode.level >= level) {
                            parentNode = nodeMetaById[parentNode.parentId];
                        } else {
                            break;
                        }
                    }
                    if (parentNode) {
                        meta.parentId = parentNode.id;
                        parentNode.childIds.push(meta.id);
                    }
                }
            }
            nodeMetas.push(meta);
            nodeMetaById[id] = meta;
            currentNode = meta;
        });
        each(nodeMetas, function(n) {
            if (n.childIds.length === 0) {
                n.isBranch = false;
            }
            tocTree.addNode(n);
        });

        tocTree.placeAt(container);
    };
});

