/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/oop/declare',
    'pastry/ui/Component',
    '../template/modal'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domQuery,
    domStyle,
    declare,
    Component,
    tmplModal
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var noop = function() { },
        extend = pastry.extend,
        defaulOptions = {
            classname: '',
            title: '',
            width: '600px'
        },
        Modal = declare({
            constructor: function(options) {
                options = extend({}, defaulOptions, options);
                var me = this,
                    domNode = domConstruct.toDom(tmplModal(options));
                extend(me, options);
                domConstruct.place(domNode, document.body);
                me.domNode = domNode;
                domStyle.set(domNode, 'width', options.width);
                domClass.add(domNode, options.classname);
                me.domNodes = {
                    title: domQuery.one('.modal-title', domNode),
                    close: domQuery.one('.modal-close', domNode),
                    body: domQuery.one('.modal-body', domNode),
                };
                me._bindEvents();
                return me;
            },
            show: function() {
                var me = this;
                domClass.add(me.domNode, 'show');
                me.isShown = true;
                me.onShow();
                return me;
            },
            hide: function() {
                var me = this;
                domClass.remove(me.domNode, 'show');
                me.isShown = false;
                me.onHide();
                return me;
            },
            isShown: false,
            _bindEvents: function() {
                var me = this;
                domEvent.on(me.domNodes.close, 'click', function() {
                    me.hide();
                });
                return me;
            },
            onShow: noop,
            onHide: noop,
        });
    return Modal;
});

