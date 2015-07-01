/* jshint strict: true, undef: true, unused: true */
// /* global xxx, yyy */

(function (GLOBAL) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-11-10
     * @description : event 模块，包括全局和局部的
     */

    var pastry = GLOBAL.pastry,

        // defination of event function {
            event = function (target) {
                target = target || this;

                var events = target._events = {}; // all events stores in the the collection: *._events

                target.on = function (name, callback, context) {
                    /*
                     * @description: 绑定事件
                     */
                    var list = events[name] || (events[name] = []);
                    list.push({
                        callback : callback,
                        context  : context
                    });
                    return target;
                };
                target.off = function (name, callback) {
                    /*
                     * @description: 解绑事件
                     */
                    if (!name) {
                        events = {};
                    }
                    var list = events[name] || [],
                        i = list.length;
                    if (!callback) {
                        list = [];
                    } else {
                        while (i > 0) {
                            i --;
                            if (list[i].callback === callback) {
                                list.splice(i, 1);
                            }
                        }
                    }
                    return target;
                };
                target.emit = function () {
                    /*
                     * @description: 触发事件
                     */
                    var args = pastry.toArray(arguments),
                        list = events[args.shift()] || [];
                    pastry.each(list, function (evt) {
                        if (!evt.callback) {
                            console.error(evt, list);
                            throw 'event callback is not defined';
                        }
                        evt.callback.apply(evt.context, args);
                    });
                    return target;
                };
                target.trigger = target.emit; // alias
                return target;
            };
        // }

    // add on(), off(), emit(), trigger() to pastry {
        event(pastry);
    // }
    // add .event to pastry {
        pastry.event = event;
    // }
}(this));

