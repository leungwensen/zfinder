/* jshint strict: true, undef: true, unused: true */
/* global define, document, self, top */

define('pastry/dom/ready', [
], function(
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : domready
     * @reference   : https://github.com/ded/domready/tree/v0.3.0
     */
    var
        fn,
        ready,
        fns    = [],
        f      = false,
        doc    = document,
        testEl = doc.documentElement,
        hack   = testEl.doScroll,
        domContentLoaded   = 'DOMContentLoaded',
        addEventListener   = 'addEventListener',
        onreadystatechange = 'onreadystatechange',
        readyState         = 'readyState',
        loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/,
        loaded    = loadedRgx.test(doc[readyState]);

    function flush(f) {
        loaded = 1;
        while (f = fns.shift()) {
            f();
        }
    }
    function checkLoaded (fn) {
        if (loaded) {
            fn();
        } else {
            fns.push(fn);
        }
    }

    if (doc[addEventListener]) {
        doc[addEventListener](domContentLoaded, fn = function () {
            doc.removeEventListener(domContentLoaded, fn, f);
            flush();
        }, f);
    }
    if (hack) {
        doc.attachEvent(onreadystatechange, fn = function () {
            if (/^c/.test(doc[readyState])) {
              doc.detachEvent(onreadystatechange, fn);
              flush();
            }
        });
    }

    return ready = hack ? function (fn) {
        if (self !== top) {
            checkLoaded(fn);
        } else {
            try {
                testEl.doScroll('left');
            } catch (e) {
                return setTimeout(function() { ready(fn); }, 50);
            }
            fn();
        }
    } : checkLoaded;
});

