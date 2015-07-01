/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/ui/Component', [
    'pastry/pastry',
    'pastry/oop/declare',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/dom/style'
], function(
    pastry,
    declare,
    domConstruct,
    domQuery,
    domStyle
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : base constructor for ui components
     */
    var body = document.body,

        extend  = pastry.extend,
        destroy = pastry.destroy,

        Component = declare('pastry-Component', [], {
            initialise: function (info) {
                var instance = this;

                extend(instance, {
                    domNode : null, // DOM 相关操作
                    // events    : {},
                    // methods   : {}
                }, info);
                return instance;
            },
            destroy: function () {
                var instance = this;

                domConstruct.destroy(instance.domNode);
                destroy(instance);
                return instance;
            },
            placeAt: function (refNode, position) {
                var instance = this,
                    domNode;

                refNode = domQuery.one(refNode) || body;
                if (domNode = instance.domNode) {
                    domConstruct.place(domNode, refNode, position);
                }
                return instance;
            },
            show: function () {
                var instance = this,
                    domNode;

                if (domNode = instance.domNode) {
                    domStyle.show(domNode);
                }
                return instance;
            },
            hide: function () {
                var instance = this,
                    domNode;

                if (domNode = instance.domNode) {
                    domStyle.hide(domNode);
                }
                return instance;
            }
        });

    return Component;
});

