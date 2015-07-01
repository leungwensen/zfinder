/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/class', [
    'pastry/pastry',
    'pastry/dom/utils',
    'pastry/dom/query'
], function(
    pastry,
    domUtils,
    domQuery
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom classList related
     * @note        : if ClassList is supported, use ClassList
     */
    var RE_spaces    = /\s+/,
        className    = 'className',
        spaceStr     = ' ',
        hasClassList = domUtils.hasClassList,
        tmpArray     = [''],
        domClass;

    function str2array (str) {
        if (pastry.isString(str)) {
            if (str && !RE_spaces.test(str)) {
                tmpArray[0] = str;
                return tmpArray;
            }
            var arr = str.split(RE_spaces);
            if (arr.length && !arr[0]) {
                arr.shift();
            }
            if (arr.length && !arr[arr.length - 1]) {
                arr.pop();
            }
            return arr;
        }
        if (!str) {
            return [];
        }
        return pastry.filter(str, function (x) {
            return x;
        });
    }
    function fillSpace (str) {
        return spaceStr + str + spaceStr;
    }

    return domClass = {
        contains: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = pastry.trim(classStr);
            if (hasClassList) {
                return node.classList.contains(classStr);
            }
            return fillSpace(node[className]).indexOf(fillSpace(classStr)) >= 0;
        },
        add: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = str2array(classStr);
            if (hasClassList) {
                pastry.each(classStr, function (c) {
                    node.classList.add(c);
                });
            } else {
                var oldClassName = node[className],
                    oldLen, newLen;
                oldClassName = oldClassName ? fillSpace(oldClassName) : spaceStr;
                oldLen = oldClassName.length;
                pastry.each(classStr, function (c) {
                    if (c && oldClassName.indexOf(fillSpace(c)) < 0) {
                        oldClassName += c + spaceStr;
                    }
                });
                newLen = oldClassName.length;
                if (oldLen < newLen) {
                    node[className] = oldClassName.substr(1, newLen - 2);
                }
            }
        },
        remove: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = str2array(classStr);
            if (hasClassList) {
                pastry.each(classStr, function (c) {
                    node.classList.remove(c);
                });
            } else {
                var cls = fillSpace(node[className]);
                pastry.each(classStr, function (c) {
                    cls = cls.replace(fillSpace(c), spaceStr);
                });
                cls = pastry.trim(cls);
                if (node[className] !== cls) {
                    node[className] = cls;
                }
            }
        },
        clear: function (node) {
            node = domQuery.one(node);
            node[className] = '';
        },
        toggle: function (node, classStr) {
            node     = domQuery.one(node);
            classStr = str2array(classStr);
            if (hasClassList) {
                pastry.each(classStr, function (c) {
                    node.classList.toggle(c);
                });
            } else {
                pastry.each(classStr, function (c) {
                    domClass[domClass.contains(node, c) ? 'remove' : 'add'](node, c);
                });
            }
        }
    };
});

