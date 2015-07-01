/* jshint strict: true, undef: true, unused: true */
/* global define, document */

define('pastry/ui/Tooltip', [
    'pastry/pastry',
    'pastry/oop/declare',
    'pastry/ui/Component',
    'pastry/dom/class',
    'pastry/dom/construct',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/template/tooltip'
], function(
    pastry,
    declare,
    Component,
    domClass,
    domConstruct,
    domQuery,
    domStyle,
    templateWrapper
) {
    'use strict';
    /*
     * @author      : 绝云
     * @date        : 2015-01-06
     * @description : 自定义ToolTip
     * @syntax      :
    //     var tooltip = new Tooltip();
    //     tooltip.show(text, node, opt);
    //     tooltip.show('some tips', $node, {
    //         gravity : 's',   // 方向
    //             // gravity:
    //             // ---------------
    //             // | nw | n | ne |
    //             // ---------------
    //             // | w  |   | e  |
    //             // ---------------
    //             // | sw | s | se |
    //             // ---------------
    //         html    : false, // 显示内容是否是 html
    //         offset  : 10     // 偏移量
    //     });
    //     tooltip.hide();
    //     tooltip.hide();
     */
    var NS = 'p_u_tooltip',

        body = document.body,

        each   = pastry.each,
        extend = pastry.extend,

        Tooltip = declare('Tooltip', [Component], {
            constructor: function (option) {
                option = option || {};
                var tooltip = this,
                    domNode;

                tooltip.option = extend({
                    gravity : 'n',   // 方向
                    html    : false, // 是否显示html
                    offset  : 6      // 偏移
                }, option);
                tooltip.id = option.id || pastry.uuid(NS);

                domNode = tooltip.domNode = domConstruct.toDom(templateWrapper(tooltip));
                tooltip.placeAt(body);
                tooltip.wrapArrow = domQuery.one('.tooltip-arrow', domNode);
                tooltip.wrapBody  = domQuery.one('.tooltip-body' , domNode);
                tooltip.hide();
                tooltip.isShown = false;
                return tooltip;
            },
            show: function (text, node, option) {
                /*
                 * @description : 显示 tooltip
                 * @syntax      : tooltip.show(text, node, option);
                 * @param       : {string } text , 要显示的 tooltip 内容
                 * @param       : {domNode} node , 要显示 tooltip 的节点
                 * @param       : {object } option  , 显示 tooltip 的参数
                 *     option.gravity : 方向
                 *     option.html    : tooltip 是否是 html
                 *     option.offset  : tooltip 显示偏移量
                 */
                var tooltip = this,
                    domNode = tooltip.domNode,
                    wrapArrow = tooltip.wrapArrow,
                    wrapBody  = tooltip.wrapBody,
                    showOpt   = extend({}, tooltip.option, option),
                    gravity   = showOpt.gravity,
                    bodyNode,
                    nPos,
                    tPos;

                // 插入内容 {
                    if (text && text !== ''){
                        wrapBody.innerHTML = '';
                        if (showOpt.html) {
                            bodyNode = domConstruct.toDom(text);
                            domConstruct.place(bodyNode, wrapBody, 'only');
                        } else {
                            wrapBody.innerHTML = text;
                        }
                    }
                // }
                // 显示 {
                    domClass.clear(wrapArrow);
                    domClass.add(wrapArrow, 'tooltip-arrow tooltip-arrow-' + gravity.charAt(0));

                    domClass.clear(domNode);
                    domClass.add(domNode, 'tooltip tooltip-' + gravity);
                    if (showOpt.className) {
                        domClass.add(domNode, 'tooltip-' + showOpt.className);
                    }
                    Component.prototype.show.call(tooltip);
                    tooltip.isShown = true;
                // }

                // 获取位置信息 {
                    nPos = extend({}, node.getBoundingClientRect(), {
                        width  : node.offsetWidth,
                        height : node.offsetHeight
                    });

                    // svg处理，解决矢量图放大缩小后坐标不正确问题 {
                        if (typeof node.nearestViewportElement === 'object') {
                            // SVG
                            var rect = node.getBoundingClientRect();
                            nPos.width = rect.width;
                            nPos.height = rect.height;
                        }
                    // }
                    tPos = {
                        width  : wrapBody.offsetWidth,
                        height : wrapBody.offsetHeight
                    };
                    showOpt.offset = showOpt.offset || 0;
                    switch (gravity.charAt(0)) {
                        case 'n':
                            tPos = {
                                top  : nPos.top + nPos.height + showOpt.offset,
                                left : nPos.left + nPos.width/2 - tPos.width/2
                            };
                            break;
                        case 's':
                            tPos = {
                                top  : nPos.top - tPos.height - showOpt.offset,
                                left : nPos.left + nPos.width/2 - tPos.width/2
                            };
                            break;
                        case 'e':
                            tPos = {
                                top  : nPos.top + nPos.height/2 - tPos.height/2,
                                left : nPos.left - tPos.width - showOpt.offset
                            };
                            break;
                        case 'w':
                            tPos = {
                                top  : nPos.top + nPos.height/2 - tPos.height/2,
                                left : nPos.left + nPos.width + showOpt.offset
                            };
                            break;
                    }
                    // 加上滚动量 {
                        tPos.top  += body.scrollTop;
                        tPos.left += body.scrollLeft;
                    //
                    if (gravity.length === 2) {
                        if (gravity.charAt(1) === 'w') {
                            tPos.left = nPos.left + nPos.width/2 - 15;
                        } else {
                            tPos.left = nPos.left + nPos.width/2 - tPos.width + 15;
                        }
                    }
                // }
                // 定位 {
                    each(tPos, function (value, key) {
                        domStyle.set(domNode, key, value + 'px');
                    });
                // }
                return tooltip;
            },
            hide: function () {
                var tooltip = this;
                tooltip.isShown = false;
                return Component.prototype.hide.call(tooltip);
            }
        });
    return Tooltip;
});

