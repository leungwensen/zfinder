/* jshint strict: true, undef: true, unused: true */
/* global define, xmind, location */

define([
    'pastry/pastry',
    'pastry/fmt/sprintf',
    'pastry/io/ajax',
    'pastry/url/querystring',
    './draw',
    './menus',
    './store'/*,
    './protocol/xmind',
    '../cgi/api'*/
], function(
    pastry,
    sprintf,
    ajax,
    querystring,
    draw,
    menus,
    store/*,
    protocolXmind,
    api*/
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var mindEditor = {
        init: function() {
            return mindEditor.resumeContent();
        },
        resumeContent: function() {
            var qs = querystring.parse(location.search.replace(/^\?/, ''));
            switch (qs.type) {
                case 'xmind':
                    ajax(sprintf('%s?raw=true', qs.file), {
                        // to get arrayBuffer {
                            type: 'text',
                            responseType: 'arraybuffer',
                        // }
                        success: function(data) {
                            var xmindInstance = xmind.open(data);
                            // other format will be transfer into xmind format first
                            store.set('xmind-instance', xmindInstance);
                            // set title, sheet, etc {
                                menus.init();
                            // }
                            draw();
                        }
                    });
                    break;
                default:
                    break;
            }
            return mindEditor;
        }
    };
    return mindEditor.init();
});

