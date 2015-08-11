/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/dom/hotkey',
    './search',
    '../component/Tab'
], function(
    domHotkey,
    search,
    Tab
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var searchIndex = 1;
    var tab = new Tab('#nav .menu .menu-item', {
        onShow: function(index) {
            if (index === searchIndex) { // search
                search.focus();
            }
        }
    });
    domHotkey.on('ctrl+f', function() {
        tab.show(searchIndex);
    });
    return tab;
});

