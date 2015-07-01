/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/construct', [
    'pastry/pastry',
    'pastry/bom/utils',
    'pastry/dom/query'
], function(
    pastry,
    bomUtils,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom constructure related
     * @reference   : https://github.com/dojo/dojo/blob/master/dom-construct.js
     */
    var domConstruct,
        win      = window,
        doc      = document || win.document,
        queryOne = domQuery.one,
        tagWrap = {
            option   : ['select'],
            tbody    : ['table'],
            thead    : ['table'],
            tfoot    : ['table'],
            tr       : ['table', 'tbody'],
            td       : ['table', 'tbody', 'tr'],
            th       : ['table', 'thead', 'tr'],
            legend   : ['fieldset'],
            caption  : ['table'],
            colgroup : ['table'],
            col      : ['table', 'colgroup'],
            li       : ['ul']
        },
        RE_tag    = /<\s*([\w\:]+)/,
        masterDiv = doc.createElement('div');

    pastry.each(tagWrap, function (tw, param) {
        tw.pre  = param === 'option' ? '<select multiple="multiple">' : '<' + tw.join('><') + '>';
        tw.post = '</' + tw.reverse().join('></') + '>';
    });

    function insertBefore (node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            parent.insertBefore(node, ref);
        }
    }
    function insertAfter (node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            if (parent.lastChild === ref) {
                parent.appendChild(node);
            } else {
                parent.insertBefore(node, ref.nextSibling);
            }
        }
    }

    return domConstruct = {
        toDom: function (frag) {
            frag += '';


            var match  = frag.match(RE_tag),
                tag    = match ? pastry.lc(match[1]) : '',
                master = masterDiv, // 每次拷贝缓存好的 div，否则会引入问题
                wrap, i, fc, df;

            if (match && tagWrap[tag]) {
                wrap = tagWrap[tag];
                master.innerHTML = wrap.pre + frag + wrap.post;
                for (i = wrap.length; i; --i) {
                    master = master.firstChild;
                }
            } else {
                master.innerHTML = frag;
            }

            if (master.childNodes.length === 1) {
                return master.removeChild(master.firstChild);
            }

            df = doc.createDocumentFragment();
            while ((fc = master.firstChild)) {
                df.appendChild(fc);
            }
            return df;
        },
        place: function (node, refNode, position) {
            refNode = queryOne(refNode);
            if (pastry.isString(node)) {
                node = /^\s*</.test(node) ? domConstruct.toDom(node, refNode.ownerDocument) : queryOne(node);
            }
            if (pastry.isNumber(position)) {
                var childNodes = refNode.childNodes;
                if (!childNodes.length || childNodes.length <= position) {
                    refNode.appendChild(node);
                } else {
                    insertBefore(node, childNodes[position < 0 ? 0 : position]);
                }
            } else {
                switch (position) {
                    case 'before':
                        insertBefore(node, refNode);
                        break;
                    case 'after':
                        insertAfter(node, refNode);
                        break;
                    case 'replace':
                        refNode.parentNode.replaceChild(node, refNode);
                        break;
                    case 'only':
                        domConstruct.empty(refNode);
                        refNode.appendChild(node);
                        break;
                    case 'first':
                        if (refNode.firstChild) {
                            insertBefore(node, refNode.firstChild);
                        } else {
                            refNode.appendChild(node);
                        }
                        break;
                    default: // 'last' or others
                        refNode.appendChild(node);
                }
            }
        },
        create: function (/*DOMNode|String*/ tag, /*DOMNode|String?*/ refNode, /*String?*/ pos) {
            /*
             * @reference: 和 dojo/dom-construct 的差别在于，为了去耦合，去除了 attr 相关的处理
             */
            if (refNode) {
                refNode = queryOne(refNode);
                doc = refNode.ownerDocument;
            }
            if (pastry.isString(tag)) {
                tag = doc.createElement(tag);
            }
            if (refNode) {
                domConstruct.place(tag, refNode, pos);
            }
            return tag;
        },
        empty: function (node) {
            node = queryOne(node);
            if ('innerHTML' in node) {
                try {
                    node.innerHTML = '';
                    return;
                } catch(e) {
                }
            }
            for (var c; c = node.lastChild;) {
                node.removeChild(c);
            }
        },
        destroy: function (node) {
            node = queryOne(node);
            if (!node) {
                return;
            }
            var parent = node.parentNode;
            if (node.firstChild) {
                domConstruct.empty(node);
            }
            if (parent) {
                if (bomUtils.isIE && parent.canHaveChildren && 'removeNode' in node) {
                    node.removeNode(false);
                } else {
                    parent.removeChild(node);
                }
            }
        }
    };
});

