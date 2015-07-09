/* jshint strict: true, undef: true, unused: true */
/* global define, document, window */

define('pastry/dom/event', [
    'pastry/pastry',
    'pastry/dom/query',
    'pastry/dom/utils'
], function(
    pastry,
    domQuery,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : event firing
     * @reference   : http://dean.edwards.name/weblog/2005/10/add-event/
     */
    var doc = document,
        win = window;

    function addEvent(element, type, handler) {
        element = domQuery.one(element);
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            // assign each event handler a unique ID
            if (!handler.$$guid) {
                handler.$$guid = addEvent.guid++;
            }
            // create a hash table of event types for the element
            if (!element.events) {
                element.events = {};
            }
            // create a hash table of event handlers for each element/event pair
            var handlers = element.events[type];
            if (!handlers) {
                handlers = element.events[type] = {};
                // store the existing event handler (if there is one)
                if (element['on' + type]) {
                    handlers[0] = element["on" + type];
                }
            }
            // store the event handler in the hash table
            handlers[handler.$$guid] = handler;
            // assign a global event handler to do all the work
            element['on' + type] = handleEvent;
        }
    }
    // a counter used to create unique IDs
    addEvent.guid = 1;

    function removeEvent(element, type, handler) {
        var delegateWrapper = handler._delegateWrapper;
        element = domQuery.one(element);
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
            element.removeEventListener(type, delegateWrapper, false);
        } else {
            // delete the event handler from the hash table
            if (element.events && element.events[type]) {
                delete element.events[type][handler.$$guid];
                delete element.events[type][delegateWrapper.$$guid];
            }
        }
    }

    function handleEvent(event) {
        /* jshint validthis:true */
        var returnValue = true,
            elem        = this;
        // grab the event object (IE uses a global event object)
        event = event ||
            fixEvent((doc.parentWindow || win).event);
        // get a reference to the hash table of event handlers
        var handlers = elem.events[event.type];
        // execute each event handler
        for (var i in handlers) {
            elem.$$handleEvent = handlers[i];
            if (elem.$$handleEvent(event) === false) {
                returnValue = false;
            }
        }
        return returnValue;
    }

    function fixEvent(event) {
        // add W3C standard event methods
        event.preventDefault  = fixEvent.preventDefault;
        event.stopPropagation = fixEvent.stopPropagation;
        return event;
    }
    fixEvent.preventDefault = function() {
        this.returnValue = false;
    };
    fixEvent.stopPropagation = function() {
        this.cancelBubble = true;
    };

    function delegate (element, type, selector, handler, capture, once) {
        if (pastry.isFunction(selector)) {
            addEvent(element, type, selector);
            return;
        }
        element = domQuery.one(element); // delegation is only for one element
        if (!domUtils.isDomNode(element)) {
            throw 'cannot bind events to non-elements: ' + element;
        }
        function wrapper (e) {
            // if this event has a delegateTarget, then we add it to the event
            // object (so that handlers may have a reference to the delegator
            // element) and fire the callback
            if (e.delegateTarget = _getDelegateTarget(element, e.target, selector)) {
                if (once === true) {
                    removeEvent(element, type, wrapper);
                }
                handler.call(element, e);
            }
        }
        handler._delegateWrapper = wrapper;
        addEvent(element, type, wrapper, capture || false);
        return handler;
    }
    function _getDelegateTarget (element, target, selector) {
        while (target && target !== element) {
            if (domQuery.match(target, selector)) {
                return target;
            }
            target = target.parentElement;
        }
        return null;
    }

    function once (element, type, selector, callback, capture) {
        delegate(element, type, selector, callback, capture, true);
    }

    return {
        on: delegate,
        off: removeEvent,
        once: once
    };
});

