/* jshint strict: true, undef: true, unused: true */
/* global define */

define([
    'pastry/pastry',
    'pastry/dom/attr',
    'pastry/dom/class',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/oop/declare'
], function(
    pastry,
    domAttr,
    domClass,
    domEvent,
    domQuery,
    domStyle,
    declare
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */

    var each = pastry.each;
    var extend = pastry.extend;
    var indexOf = pastry.indexOf;
    var isNumber = pastry.isNumber;
    var some = pastry.some;

    var defaultOptions = {
        activeClassname: 'active',
        // AOP {
            //afterHide: noop,
            //afterShow: noop,
            //beforeHide: noop,
            //beforeShow: noop,
            //onHide: noop,
            onShow: noop,
        // }
        // plugin {
            //doHide: noop,
            //doShow: noop,
        // }
        targetAttr: 'data-target',
        trigger: 'click', // or hover or other dom event names
    };

    function noop() {}

    function eachTabTargets(tab, targetAttr, cb) {
        if (!tab) {
            return;
        }
        var targets = [];
        var tabTargetsSelector = domAttr.get(tab, targetAttr);
        if (tabTargetsSelector) {
            targets = domQuery.all(tabTargetsSelector);
        }
        each(targets, function(target) {
            cb(target);
        });
    }

    return declare({
        constructor: function(tabsSelector, options) {
            var me = this;
            options = extend({}, defaultOptions, options);
            extend(me, {
                options: options,
                tabs: domQuery.all(tabsSelector),
            });
            if (!me.tabs.length) {
                throw 'tabs not found';
            }
            some(me.tabs, function(tab, index) {
                if (domClass.contains(tab, options.activeClassname)) {
                    me.show(index);
                    return true;
                }
            });
            if (!isNumber(me.activeTabIndex)) {
                me.show(0);
            }
            each(me.tabs, function(tab, index) {
                if (index !== me.activeTabIndex) {
                    eachTabTargets(tab, options.targetAttr, function(target) {
                        domStyle.hide(target);
                    });
                }
            });
            each(me.tabs, function(tab) {
                domEvent.on(tab, options.trigger, function() {
                    me.show(indexOf(me.tabs, tab));
                });
            });
        },
        show: function(index) {
            var me = this;
            var options = me.options;
            var targetAttr = options.targetAttr;
            var activeClassname = options.activeClassname;
            var onShow = options.onShow;

            var oldTab = me.tabs[me.activeTabIndex];
            var newTab = me.tabs[index];

            if (!newTab) {
                throw 'invalid index to show';
            }
            if (isNumber(me.activeTabIndex)) {
                eachTabTargets(oldTab, targetAttr, function(target) {
                    domStyle.hide(target);
                });
                domClass.remove(oldTab, activeClassname);
            }
            eachTabTargets(newTab, targetAttr, function(target) {
                domStyle.show(target);
            });
            domClass.add(newTab, activeClassname);
            onShow(index, newTab, me);
            me.activeTabIndex = index;
        }
    });
});

