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
    var each = pastry.each;
    var drawOptions = {
        'x': 0,
        'y': 0,
        'line-width': 3,
        'line-length': 50,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'black',
        'element-color': 'black',
        'fill': 'white',
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'block',
        'scale': 1,
        // style symbol types
        'symbols': {
            'start': {
                'font-color': 'red',
                'element-color': 'green',
                'fill': 'yellow'
            },
            'end':{
                'class': 'end-element'
            }
        },
        // even flowstate support ;-)
        'flowstate': {
            'past': {
                'fill': '#CCCCCC',
                'font-size': 12
            },
            'current': {
                'fill': 'yellow',
                'font-color': 'red',
                'font-weight': 'bold'
            },
            'future': {
                'fill': '#FFFF99'
            },
            'request': {
                'fill': 'blue'
            },
            'invalid': {
                'fill': '#444444'
            },
            'approved': {
                'fill': '#58C4A3',
                'font-size': 12,
                'yes-text': 'APPROVED',
                'no-text': 'n/a'
            },
            'rejected': {
                'fill': '#C45879',
                'font-size': 12,
                'yes-text': 'n/a',
                'no-text': 'REJECTED'
            }
        }
    };
    return function(scope) {
        each(domQuery.all('.flowchart', scope), function(container) {
            try {
                var codeElement = domQuery.one('.flowchart-code', container),
                    graphElement = domQuery.one('.flowchart-graph', container);
                var diagram = flowchart.parse(codeElement.innerHTML);
                diagram.drawSVG(graphElement, drawOptions);
            } catch(e) {
                console.log(e);
            }
        });
    };
});

