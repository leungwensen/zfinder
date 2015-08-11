/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/io/ajax',
    '../component/Modal',
    '../component/markdownRenderer',
    '../global/CONST'
], function(
    pastry,
    domClass,
    ajax,
    Modal,
    markdownRenderer,
    CONST
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var tipsDialog = new Modal({
        title: 'tips',
        classname: 'markdown-editor-tips',
        width: '600px'
    });
    var tipsDialogBody = tipsDialog.domNodes.body;
    domClass.add(tipsDialogBody, 'markdown-body');
    ajax(CONST.serverRoot + '/doc/markdown-editor.markdown', {
        data: {
            raw: true
        },
        success: function(res) {
            markdownRenderer(tipsDialogBody, res);
        }
    });
    return tipsDialog;
});

