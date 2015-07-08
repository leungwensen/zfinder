/* jshint strict: true, undef: true, unused: true */
/* global define, moment, filesize, history, console */

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
        toArray = pastry.toArray,
        isPlainObject = pastry.isPlainObject;
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
    };
});

