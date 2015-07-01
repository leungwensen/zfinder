/* jshint strict: true, undef: true */
/* global define */

define('pastry/text/template', [
    'pastry/pastry',
    'pastry/html/escape'
], function(
    pastry,
    htmlEscape
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : template engine
     */
    var template,
        cache     = {},
        helper    = {},

        trim = pastry.trim,

        RE_parser = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(?:(\{%)([\s\S]+?)(%\}))/g;
        // defaultOpitons = {}; // TODO add grammar aliases, etc.

    function replacer (s, p1, p2, p3, p4, p5, p6) {
        if (p1) { // whitespace, quote and backspace in HTML context
            return {
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t",
                " " : " "
            }[p1] || "\\" + p1;
        }
        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            p3 = trim(p3);
            if (p2 === "=") {
                return "'+_e(" + p3 + ")+'";
            }
            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
        }
        if (p4 && p5 && p6) { // evaluation two matched tags: {% * %}
            // COMMENT: this is for fixing bug mentioned in test/jasmine/text/template.spec.js
            return "';" + trim(p5) + " _s+='";
        }
    }
    function parse (str) {
        return str
            .replace(RE_parser, replacer)
            .replace(/\\n\s*/g, ''); // 要是存在回车符号，会引起多解释一个 #text 对象的 bug
    }

    // add helpers to pastry to pass to compiled functions, can be extended {
        pastry.extend(helper, htmlEscape);
    // }

    return pastry.template = template = {
        helper : helper,
        parse  : parse,
        compile: function (str) {
            if (!pastry.isString(str)) {
                return str;
            }

            /*jshint -W054*/ // new Function()
            return cache[str] || (cache[str] = new Function('obj', 'helper', 'ne',
                    "var _e=ne?function(s){return s;}:helper.escape," +
                        "print=function(s,e){" +
                            "_s+=e?(s==null?'':s):_e(s);" +
                        "};" +
                    "obj=obj||{};" + // 当obj传空的时候
                    "with(obj){" +
                        // include helper {
                            // "include = function (s, d) {" +
                            //     "_s += tmpl(s, d);}" + "," +
                        // }
                        "_s='" +
                        parse(str) +
                        "';" +
                    "}" +
                    "return _s;"
                )
            );
        },
        render: function (str, data, option) {
            option = option || {};
            return template.compile(str)(data, template.helper, option.ne);
        }
    };
});

