/* jshint strict: true, undef: true, unused: true */
/* global define, moment, filesize, history, console, window, document */

define([
    'pastry/pastry',
    './iconByExtname'
], function(
    pastry,
    iconByExtname
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var lc = pastry.lc,
        isPlainObject = pastry.isPlainObject,
        some = pastry.some,
        toArray = pastry.toArray;
    return {
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
        processNode: function(node) {
            node.mtimeReadable = node.mtime ? moment(node.mtime).fromNow() : '';
            node.sizeReadable = node.isBranch ? '--' : node.size ? filesize(node.size) : '';
            return node;
        },
        pushState: function(/*data, title, url*/) {
            var args = toArray(arguments),
                data = isPlainObject(args[0]) ? args.shift() : null,
                title = args.length > 1 ? args.shift() : null,
                url = args[0];
            try {
                history.pushState(data, title, url);
            } catch(e) {
                console.log('history api is not supported!');
            }
        },
        setSelectValue: function(selectDomNode, value) {
            some(selectDomNode.options, function(option, i) {
                if (option.value === value + '') {
                    selectDomNode.selectedIndex = i;
                    return true;
                }
                return false;
            });
        },
        getSelectValue: function(selectDomNode) {
            return selectDomNode.options[selectDomNode.selectedIndex].value;
        },
        getWindowSize: function() {
            var body = document.body;
            var element = body.documentElement;
            var x = window.innerWidth || element.clientWidth || body.clientWidth;
            var y = window.innerHeight|| element.clientHeight|| body.clientHeight;
            return {
                width: x,
                height: y
            };
        }
    };
});

