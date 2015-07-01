/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/query', [
    'pastry/pastry',
    'pastry/dom/utils'
], function(
    pastry,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : selector
     * @note        : browser only
     * @note        : MODERN browsers only
     */
    var // utils {
            toArray   = pastry.toArray,
            arrayLike = pastry.isArrayLike,
            isString  = pastry.isString,
            isDomNode = domUtils.isDomNode,
            contains  = domUtils.contains,
            testDiv   = domUtils.testDiv,
        // }
        // matchesSelector {
            matchesSelector = testDiv.matches ||
                testDiv.webkitMatchesSelector ||
                testDiv.mozMatchesSelector    ||
                testDiv.msMatchesSelector     ||
                testDiv.oMatchesSelector,
            hasMatchesSelector = matchesSelector && matchesSelector.call(testDiv, 'div'),
        // }

        doc = document,
        win = window,
        nodeTypeStr   = 'nodeType',
        re_quick      = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, // 匹配快速选择器
        result        = {};

    function normalizeRoot (root) {
        if (!root) {
            return doc;
        }
        if (isString(root)) {
            return query(root)[0];
        }
        if (!root[nodeTypeStr] && arrayLike(root)) {
            return root[0];
        }
        return root;
    }
    function query (selector, optRoot) {
        /*
         * description: 选择器
         */
        var root = normalizeRoot(optRoot),
            match;

        if (!root || !selector) {
            return [];
        }
        if (selector === win || isDomNode(selector)) {
            return !optRoot || (selector !== win && isDomNode(root) && contains(selector, root)) ?
                [selector] : [];
        }
        if (selector.nodeType === 11) { // document fragment
            return pastry.toArray(selector.childNodes);
        }
        if (selector && arrayLike(selector)) {
            return pastry.flatten(selector);
        }

        // 简单查询使用快速查询方法 {
            if (isString(selector) && (match = re_quick.exec(selector))) {
                if (match[1]) {
                    return [root.getElementById(match[1])];
                } else if (match[2] ) {
                    return toArray(root.getElementsByTagName(match[2]));
                } else if (match[3]) {
                    return toArray(root.getElementsByClassName(match[3]));
                }
            }
        // }
        if (selector && (selector.document || (selector[nodeTypeStr] && selector[nodeTypeStr] === 9))) {
            return !optRoot ? [selector] : [];
        }
        return toArray((root).querySelectorAll(selector));
    }
    function queryOne (selector, optRoot) {
        return query(selector, optRoot)[0];
    }

    function match (element, selector) {
        /*
         * @matches selector
         */
        if (hasMatchesSelector) {
            return matchesSelector.call(element, selector);
        }
        var parentElem = element.parentNode,
            nodes;

        // if the element is an orphan, and the browser doesn't support matching
        // orphans, append it to a documentFragment
        if (!parentElem && !hasMatchesSelector) {
            parentElem = document.createDocumentFragment();
            parentElem.appendChild(element);
        }
            // from the parent element's context, get all nodes that match the selector
        nodes = query(selector, parentElem);

        // since support for `matches()` is missing, we need to check to see if
        // any of the nodes returned by our query match the given element
        return pastry.some(nodes, function (node) {
            return node === element;
        });
    }

    // 封装 api {
        return pastry.extend(result, {
            all   : query,
            one   : queryOne,
            match : match
        });
    // }
});

