/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/attr', [
    'pastry/pastry',
    'pastry/bom/utils',
    'pastry/dom/utils',
    'pastry/dom/query',
    'pastry/dom/construct',
    'pastry/dom/style'
], function(
    pastry,
    bomUtils,
    domUtils,
    domQuery,
    domConstruct,
    domStyle
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : 获取／设置 dom 元素的属性
     */
    var bomVersions    = bomUtils.versions,
        ieVersion      = bomVersions.msie || 0,
        lcStr          = pastry.lc,
        isBoolean      = pastry.isBoolean,
        isFunction     = pastry.isFunction,
        isString       = pastry.isString,
        hasTextContent = domUtils.hasTextContent,
        queryOne       = domQuery.one,
        propNames = {
            'class'     : 'className',
            'for'       : 'htmlFor',
            tabindex    : 'tabIndex',
            readonly    : 'readOnly',
            colspan     : 'colSpan',
            frameborder : 'frameBorder',
            rowspan     : 'rowSpan',
            textcontent : 'textContent',
            valuetype   : 'valueType'
        },
        forcePropNames = {
            innerHTML   : 1,
            textContent : 1,
            className   : 1,
            htmlFor     : !!ieVersion,
            value       : 1
        },
        attrNames = {
            classname : 'class',
            htmlfor   : 'for',
            tabindex  : 'tabIndex',
            readonly  : 'readOnly'
        },
        domAttr;

    function hasAttr (node, name) {
        var attr = node.getAttributeNode && node.getAttributeNode(name);
        return !!attr && attr.specified;
    }
    function getText (node) {
        var text = '',
            ch   = node.childNodes;
        for(var i = 0, n; n = ch[i]; i++){
            //Skip comments.
            if(n.nodeType !== 8){
                if(n.nodeType === 1){
                    text += getText(n);
                }else{
                    text += n.nodeValue;
                }
            }
        }
        return text;
    }
    function getProp (node, name) {
        var lc       = name.toLowerCase(),
            propName = exports.names[lc] || name;
        if (propName === 'textContent' && !hasTextContent) {
            return getText(node);
        }
        return node[propName];  // Anything
    }
    function setProp (node, name, value) {
        var l = arguments.length;
        if(l === 2 && !isString(name)){ // inline'd type check
            // the object form of setter: the 2nd argument is a dictionary
            for(var x in name){
                setProp(node, x, name[x]);
            }
            return node; // DomNode
        }
        var lc = lcStr(name),
            propName = propNames[lc] || name;
        if (propName === 'style' && !isString(value)) { // inline'd type check
            // special case: setting a style
            domStyle.set(node, value);
            return node; // DomNode
        }
        if (propName === 'innerHTML') {
            if(ieVersion && lcStr(node.tagName) in {
                col      : 1,
                colgroup : 1,
                table    : 1,
                tbody    : 1,
                tfoot    : 1,
                thead    : 1,
                tr       : 1,
                title    : 1
            }){
                domConstruct.empty(node);
                node.appendChild(domConstruct.toDom(value, node.ownerDocument));
            } else {
                node[propName] = value;
            }
            return node; // DomNode
        }
        if (propName === 'textContent' && !hasTextContent) {
            domConstruct.empty(node);
            node.appendChild(node.ownerDocument.createTextNode(value));
            return node;
        }
        node[propName] = value;
        return node;
    }

    return domAttr = {
        has: function (node, name) {
            var lc = lcStr(name);
            return forcePropNames[propNames[lc] || name] || hasAttr(queryOne(node), attrNames[lc] || name);
        },
        get: function (node, name) {
            node = queryOne(node);
            var lc        = lcStr(name),
                propName  = propNames[lc] || name,
                forceProp = forcePropNames[propName],
                value     = node[propName],
                attrName; // should we access this attribute via a property or via getAttribute()?

            if (forceProp && !pastry.isUndefined(value)) {
                // node's property
                return value;   // Anything
            }

            if (propName === 'textContent') {
                return getProp(node, propName);
            }

            if (propName !== 'href' && (isBoolean(value) || isFunction(value))) {
                // node's property
                return value;   // Anything
            }
            // node's attribute
            // we need _hasAttr() here to guard against IE returning a default value
            attrName = attrNames[lc] || name;
            return hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
        },
        set: function (node, name, value) {
            node = queryOne(node);
            if(arguments.length === 2){ // inline'd type check
                // the object form of setter: the 2nd argument is a dictionary
                for(var x in name){
                    domAttr.set(node, x, name[x]);
                }
                return node; // DomNode
            }
            var lc        = name.toLowerCase(),
                propName  = propNames[lc] || name,
                forceProp = forcePropNames[propName];
            if (propName === 'style' && isString(value)) { // inline'd type check
                // special case: setting a style
                domStyle.set(node, value);
                return node; // DomNode
            }
            if (forceProp || isBoolean(value) || isFunction(value)) {
                return setProp(node, name, value);
            }
            // node's attribute
            node.setAttribute(attrNames[lc] || name, value);
            return node; // DomNode
        },
        remove: function (node, name) {
            queryOne(node).removeAttribute(attrNames[lcStr(name)] || name);
        },
        getNodeProp: function (node, name) {
            node = queryOne(node);
            var lc       = lcStr(name),
                propName = propNames[lc] || name,
                attrName;
            if ((propName in node) && propName !== "href") {
                // node's property
                return node[propName];  // Anything
            }
            // node's attribute
            attrName = attrNames[lc] || name;
            return hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
        }
    };
});

