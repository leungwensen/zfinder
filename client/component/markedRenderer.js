/* jshint strict: true, undef: true, unused: true */
/* global define, flowchart, console, document, mermaid */

define([
    'pastry/pastry',
    'pastry/dom/attr',
    'pastry/dom/query',
    'pastry/dom/style',
    './marked'
], function(
    pastry,
    domAttr,
    domQuery,
    domStyle,
    marked
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var each = pastry.each,
        destroy = pastry.destroy;

    var flowchartOptions = {
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
    var flowchartInstanceCache = [];

    function drawFlowcharts(scope) {
        /*
         * scope is a node with structure like:
         *     <div class="flowchart">
         *         <div class="flowchart-graph"></div>
         *         <script class="flowchart-code">{%= code %}</script>
         *     </div>
         */
        each(flowchartInstanceCache, function(instance) {
            destroy(instance);
        });
        flowchartInstanceCache = [];
        each(domQuery.all('.flowchart', scope), function(container) {
            try {
                var codeElement = domQuery.one('.flowchart-code', container);
                var graphElement = domQuery.one('.flowchart-graph', container);
                var diagram = flowchart.parse(codeElement.innerHTML);
                diagram.drawSVG(graphElement, flowchartOptions);
                flowchartInstanceCache.push(diagram);
            } catch(e) {
                console.log(e);
            }
        });
    }
    function renderMermaidGraphs(scope) {
        /*
         * scope is the node to render in
         */
        scope = scope || document.body;
        mermaid.init(null, domQuery.all('.mermaid', scope));

        // fix GANTT diagrams (width of lanes is not set correctly) {
            var ganttGraphs = domQuery.all('.mermaid[data-type=gantt] svg', scope);
            each(ganttGraphs, function(svg) {
                var lanes = domQuery.all('g rect.section');
                each(lanes, function(lane) {
                    domAttr.set(lane, 'width', domStyle.get(svg, 'width'));
                });
            });
        // }
    }

    return function(container, markdownString) {
        container.innerHTML = marked(markdownString);
        renderMermaidGraphs(container); // render mermaid graphs
        drawFlowcharts(container);
    };
});

