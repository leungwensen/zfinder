/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/construct',
    'pastry/oop/declare',
    'pastry/ui/Component',
    '../template/loadingSpinner'
], function(
    pastry,
    domConstruct,
    declare,
    Component,
    tmplWrapper
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var LoadingSpinner = declare('LoadingSpinner', [Component], {
        constructor: function() {
            this.domNode = domConstruct.toDom(tmplWrapper());
        }
    });
    return LoadingSpinner;
});

