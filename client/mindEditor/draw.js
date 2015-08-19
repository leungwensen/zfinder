/* jshint strict: true, undef: true, unused: true */
/* global define, dagreD3, d3 */

define([
    'pastry/pastry',
    'pastry/dom/attr',
    'pastry/dom/query',
    'pastry/dom/style',
    'pastry/fmt/sprintf',
    './store',
    '../template/mindEditor/topic'
], function(
    pastry,
    domAttr,
    domQuery,
    domStyle,
    sprintf,
    store,
    tmplTopic
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: description
     */
    var g = new dagreD3.graphlib.Graph().setGraph({
        nodesep: 70,
        ranksep: 50,
        rankdir: 'LR',
        marginx: 20,
        marginy: 20
    });
    var svg = d3.select('svg');
    var inner = svg.select('g');

    var container = domQuery.one('#main');
    function fixCanvasSize() {
        // fix canvas
        svg.attr('width', domStyle.get(container, 'width'));
        svg.attr('height', domStyle.get(container, 'height'));
    }
    fixCanvasSize();

    // Set up zoom support
    var zoom = d3.behavior.zoom().on('zoom', function() {
        inner.attr(
            'transform',
            sprintf('translate(%s)scale(%s)', d3.event.translate, d3.event.scale)
        );
    });
    svg.call(zoom);

    // Create the renderer
    var render = new dagreD3.render();

    function processTopic(topic, parentTopic) {
        var hyperlinkType = '';
        var hyperlink = topic.hyperlink || '';
        if (hyperlink.match(/^file/)) {
            hyperlinkType = 'file';
        }
        if (hyperlink.match(/^http/)) {
            hyperlinkType = 'http';
        }
        if (hyperlink.match(/^xmind/)) {
            hyperlinkType = 'xmind';
        }
        return pastry.extend({}, {
            hyperlinkType: hyperlinkType,
            styleId: '',
            classname: topic.isRootTopic ?
                'primary' :
                parentTopic && parentTopic.isRootTopic ?
                    'secondary' :
                    'normal'
        }, topic);
    }
    function setGraph(topic, parentTopic) {
        topic = processTopic(topic, parentTopic);
        g.setNode(topic.id, {
            class: topic.classname,
            labelType: 'html',
            label: tmplTopic(topic, true),
            rx: 5,
            ry: 5,
            padding: 0,
        });
        if (topic.children && topic.children.length) {
            pastry.each(topic.children, function(child) {
                setGraph(child, topic);
                var lineAttrs = {
                    label: '',
                    //arrowhead: 'vee',
                    lineInterpolate: 'basis'
                };
                if (child.type === 'detached') {
                    lineAttrs.style = 'fill: none; stroke-dasharray: 5, 5;';
                    //lineAttrs.label = 'detached';
                }
                //if (child.type !== 'detached') {
                    g.setEdge(topic.id, child.id, lineAttrs);
                //}
            });
        }
    }

    return function(sheetIndex) {
        var xmindInstance = store.get('xmind-instance');
        if (xmindInstance) {
            sheetIndex = sheetIndex || 0;
            var sheet = xmindInstance.sheets[sheetIndex];
            var rootTopic = sheet.rootTopic;

            setGraph(rootTopic.toPlainObject());

            // Run the renderer. This is what draws the final graph.
            render(inner, g);

            // Center the graph
            // Zoom and scale to fit
            var zoomScale = zoom.scale();
            var graphWidth = g.graph().width + 80;
            var graphHeight = g.graph().height + 40;
            var width = parseInt(svg.style('width').replace(/px/, ''));
            var height = parseInt(svg.style('height').replace(/px/, ''));
            zoomScale = Math.min(width / graphWidth, height / graphHeight);
            var translate = [
                (width/2) - ((graphWidth*zoomScale)/2),
                (height/2) - ((graphHeight*zoomScale)/2)
            ];
            zoom.translate(translate);
            zoom.scale(zoomScale);
            zoom.event(svg);
        }
    };
});

