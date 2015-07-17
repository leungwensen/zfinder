/* jshint strict: true, undef: true, unused: false */
/* global define, marked, katex, mermaid */

define([
    'pastry/pastry',
    'pastry/fmt/sprintf',
    'pastry/html/escape',
    '../template/markedMath',
    '../template/markedMermaidGraph',
    '../template/markedTaskListItem'
], function(
    pastry,
    sprintf,
    htmlEscape,
    tmplMath,
    tmplMermaidGraph,
    tmpTaskListItem
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var mermaidError,
        each = pastry.each,
        trim = pastry.trim,
        Renderer = marked.Renderer,
        RendererPrototype = Renderer.prototype,
        renderer = new Renderer(),
        unescape = htmlEscape.unescape;

    mermaid.parseError = function(err/*, hash*/){
        mermaidError = err;
    };

    renderer.listitem = function(text) { // list item
        if(!/^\[[ x]\]\s/.test(text)) { // normal list item
            return marked.Renderer.prototype.listitem(text);
        }
        // task list item {
            return tmpTaskListItem({
                checked: /^\[x\]\s/.test(text),
                text: text.substring(3)
            });
        // }
    };

    renderer.codespan = function(code) { // inline code
        if(/^\$.+\$$/.test(code)) { // inline math typesetting
            var raw = /^\$(.+)\$$/.exec(code)[1],
                line = unescape(raw);
            try{
                return katex.renderToString(line, {
                    displayMode: false
                });
            } catch(err) {
                return sprintf('<code>%s</code>', err);
            }
        }
        return RendererPrototype.codespan.apply(this, arguments);
    };

    renderer.code = function(code, lang, escaped, lineNumber) { // code block
        code = trim(code);
        var firstLine = trim(code.split(/\n/)[0]);
        if (firstLine === 'math') { // math typesetting
            var tex = '';
            each(code.replace(/^math\s*/, '').split(/\n\n/), function(line){
                // next if we have two empty lines
                line = trim(line);
                if (line.length > 0) {
                    try {
                        tex +=  katex.renderToString(line, {
                            displayMode: true
                        });
                    } catch(err) {
                        tex += sprintf('<pre>%s</pre>', err);
                    }
                }
            });
            return tmplMath({
                lineNumber: lineNumber,
                tex: tex,
            }, true);
        } else if ( // graphs
            firstLine === 'gantt' ||
            firstLine === 'sequenceDiagram' ||
            firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)
        ){
            if(firstLine === 'sequenceDiagram') {
                code += '\n'; // empty line in the end or error
            }
            var valid = mermaid.parse(code);
            return tmplMermaidGraph({
                code: code,
                error: mermaidError,
                lineNumber: lineNumber,
                valid: valid,
            }, true);
        }
        return RendererPrototype.code.apply(this, arguments);
    };

    marked.setOptions({
        breaks: false,
        gfm: true,
        pedantic: false,
        renderer: renderer,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        tables: true,
    });
    return marked;
});

