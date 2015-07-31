/* jshint strict: true, undef: true, unused: true */
/* global define, window, document */

define([
    'pastry/pastry',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/event',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/oop/declare',
    '../template/resizer'
], function(
    pastry,
    domClass,
    domConstruct,
    domEvent,
    domQuery,
    domStyle,
    declare,
    tmplResizer
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: resize a domNode
     * @syntax:
     // new Resizer(domNode, {
     //     directions : [],  // ['e', 's', 'w', 'n', 'ne', 'se', 'sw', 'nw'] 的一个子集.
     // });
     */
    var win = window,

        DEFAULT_DIRECTIONS = [
            'e',
            's',
            'se'
        ],
        defaultOpt = {
            minWidth: 0,
            maxWidth: Infinity,
            minHeight: 0,
            maxHeight: Infinity
        },
        ON_RESIZE = function () { },
        body = document.body,
        cssNoSelect = 'non-select',

        Resizer = declare('pastry/ui/Resizer', [], {
            constructor: function (domNode, opts) {
                opts = pastry.merge({}, defaultOpt, opts);
                if (!pastry.isArray(opts.directions) || opts.directions.length === 0) {
                    opts.directions = DEFAULT_DIRECTIONS;
                }
                opts.onResize = opts.onResize || ON_RESIZE;

                var resizer = this;
                resizer.domNode = domQuery.one(domNode);
                resizer.options = opts;
                pastry.each(opts.directions, function (direction) {
                    resizer._createHandler(direction);
                });
                return resizer;
            },
            _createHandler: function (direction) {
                var resizer = this,
                    domNode = resizer.domNode,
                    resizerDom = tmplResizer({
                        direction: direction
                    }),
                    limitRange = resizer._limitRange.bind(resizer, direction),
                    resizerWrapDom,
                    handlerDiv;

                function resize (e) {
                    e.stopPropagation();
                    if (direction.indexOf('n') !== -1) {
                        domStyle.set(domNode, 'height', limitRange(resizer._startH + (resizer._startY - e.pageY)) + 'px');
                    }
                    if (direction.indexOf('s') !== -1) {
                        domStyle.set(domNode, 'height', limitRange(resizer._startH + (e.pageY - resizer._startY)) + 'px');
                    }
                    if (direction.indexOf('e') !== -1) {
                        domStyle.set(domNode, 'width', limitRange(resizer._startW + (e.pageX - resizer._startX)) + 'px');
                    }
                    if (direction.indexOf('w') !== -1) {
                        domStyle.set(domNode, 'width', limitRange(resizer._startW + (resizer._startX - e.pageX)) + 'px');
                    }
                    // prevent selecting
                    domClass.add(body, cssNoSelect);
                }
                function stop (e) {
                    e.stopPropagation();
                    domEvent.off(win, 'mousemove', resize);
                    domEvent.off(win, 'mouseup', stop);

                    resizer._triggerResize();

                    // enable selecting again
                    domClass.remove(body, cssNoSelect);
                }
                function start (e) {
                    e.stopPropagation();
                    resizer._startX = e.pageX;
                    resizer._startY = e.pageY;
                    resizer._startW = domNode.offsetWidth;
                    resizer._startH = domNode.offsetHeight;
                    domEvent.on(win, 'mouseup', stop);
                    domEvent.on(win, 'mousemove', resize);
                }

                domConstruct.place(resizerDom, domNode, 'first');
                resizerWrapDom = domQuery.one('.resizer-d-' + direction, domNode);
                handlerDiv = domQuery.one('.resizer-handler', resizerWrapDom);
                if (resizer.options.needShrink) {
                    resizer.btn = domQuery.one('.resizer-btn', resizerWrapDom);
                    resizer.toggle = function() {
                        resizer._toggle(resizerWrapDom, resizer.btn);
                    };

                    domEvent.on(resizer.btn, 'click', function() {
                        resizer.toggle.call(resizer);
                        if (pastry.isFunction(resizer.options.onClick)) {
                            resizer.options.onClick(resizer.isHide);
                        }
                    });
                }
                domEvent.on(handlerDiv, 'mousedown', start);
            },
            setSize: function(width, height) {
                var resizer = this,
                    domNode = resizer.domNode,
                    limitRange;
                if (width) {
                    limitRange = resizer._limitRange.bind(resizer, 'w');
                    domStyle.set(domNode, 'width', limitRange(width) + 'px');
                }
                if (height) {
                    limitRange = resizer._limitRange.bind(resizer, 'n');
                    domStyle.set(domNode, 'height', limitRange(height) + 'px');
                }
                return resizer;
            },
            _triggerResize: function(){
                var domNode = this.domNode;
                this.options.onResize(
                    domStyle.get(domNode, 'height'),
                    domStyle.get(domNode, 'width')
                );
            },
            _limitRange: function(direction, value) {
                var resizer = this,
                    max = direction === 'w' || direction === 'e' ? resizer.options.maxWidth : resizer.options.maxHeight,
                    min = direction === 'w' || direction === 'e' ? resizer.options.minWidth : resizer.options.minHeight;
                return Math.min(max, Math.max(min, value));
            }
        });
    return Resizer;
});
