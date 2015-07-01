/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/module/loader', [
    'pastry/pastry',
    'pastry/Module',
    'pastry/module/path',
    'pastry/module/request'
], function (
    pastry,
    Module,
    path,
    request
) {
    'use strict';
    /*
     * @author      : wensen.lws
     * @description : 异步加载模块
     * @note        : browser only
     */
    var data          = Module._data,
        moduleByUri   = data.moduleByUri,
        executedByUri = data.executedByUri,
        loadingByUri  = data.loadingByUri = {},
        doc           = document,
        win           = window,
        id2Uri        = path.id2Uri,

        each = pastry.each,

        interactiveScript;

    Module.resolve = id2Uri;
    Module.request = request;

    function getCurrentScript() {
        if (Module.currentlyAddingScript) {
            return Module.currentlyAddingScript.src;
        }
        // 取得正在解析的script节点
        if (doc.currentScript) { // firefox 4+
            return doc.currentScript.src;
        }
        // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
        var stack;
        try {
            throw new Error();
        } catch(e) {
            // safari的错误对象只有line, sourceId, sourceURL
            stack = e.stack;
            if (!stack && win.opera) {
                // opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(' ');
            }
        }
        if (stack) {
            /*
             * e.stack最后一行在所有支持的浏览器大致如下:
             * chrome23: at http://113.93.50.63/data.js:4:1
             * firefox17: @http://113.93.50.63/query.js:4
             * opera12: @http://113.93.50.63/data.js:4
             * IE10: at Global code (http://113.93.50.63/data.js:4:1)
             */
            stack = stack.split( /[@ ]/g).pop(); // 取得最后一行,最后一个空格或@之后的部分
            stack = (stack[0] === '(') ? stack.slice(1, -1) : stack;
            return stack.replace(/(:\d+)?:\d+$/i, ''); // 去掉行号与或许存在的出错字符起始位置
        }
        if (interactiveScript && interactiveScript.readyState === "interactive") {
            return interactiveScript.src;
        }
        var nodes = doc.getElementsByTagName('script');
        for (var i = 0, node; node = nodes[i++];) {
            if (node.readyState === 'interactive') {
                interactiveScript = node;
                return node.src;
            }
        }
    }

    Module
        .on('module-metaGot', function (meta) {
            var src = getCurrentScript();
            if (src) {
                meta.uri = src;
            } else {
                meta.uri = data.cwd;
            }
            if (src === '' || (pastry.isString(src) && src === data.cwd)) {
                if (meta.id) { // script tag 中的具名模块
                    // meta.id = './' + meta.id;
                } else { // script tag 中的匿名模块
                    meta.uri = data.cwd + ('#' + pastry.uuid());
                }
            }
        })
        .on('module-initialised', function (mod) {
            var uri,
                id;
            if (!(pastry.isString(mod.uri) && mod.uri.indexOf('/') > -1)) {
                mod.uri = id2Uri(mod.id);
            }
            uri = mod.uri;
            // 同一 script 中定义了多个 id 的情况 {
                if (id = mod.id) {
                    mod.relativeUri = uri.indexOf(id + '.') > -1 ?
                        uri : id2Uri('./' + mod.id, mod.uri);
                }
            // }
        })
        .on('module-depsProcessed', function (mod) {
            each(mod.deps, function (id, index) {
                var uri;
                if (moduleByUri[id]) {
                    uri = id;
                } else {
                    uri = id2Uri(id, mod.relativeUri || mod.uri);
                }
                mod.deps[index] = uri;
                if (!moduleByUri[uri] && !loadingByUri[uri] && !executedByUri[uri]) {
                    request(uri);
                    loadingByUri[uri] = true;
                }
            });
        });
});


