/* jshint strict: true, undef: true, unused: true */
/* global define, flowchart, console */

define([
    'pastry/pastry',
    'pastry/dom/query'
], function(
    pastry,
    domQuery
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var each = pastry.each,
        destroy = pastry.destroy;

    var drawOptions = {
        'x': 0,
        'y': 0,
        'line-width': 2,
        'line-length': 40,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'grey',
        'element-color': 'grey',
        'fill': 'lightyellow',
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'block',
        'scale': 1,
    };

    var instanceCache = [];

    return function(scope) {
        each(instanceCache, function(instance) {
            destroy(instance);
        });
        instanceCache = [];
        each(domQuery.all('.flowchart', scope), function(container) {
            try {
                var codeElement = domQuery.one('.flowchart-code', container),
                    graphElement = domQuery.one('.flowchart-graph', container);
                var diagram = flowchart.parse(codeElement.innerHTML);
                diagram.drawSVG(graphElement, drawOptions);
                instanceCache.push(diagram);
            } catch(e) {
                console.log(e);
            }
        });
    };
});

