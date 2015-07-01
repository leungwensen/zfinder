/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/camelCase', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     * @reference   : https://github.com/substack/camelize/blob/master/index.js
     */

    function camelise (str) {
        return str
            .replace(/^[_.\- ]+/, '')
            .replace(/[_.-](\w|$)/g, function (_, x) {
                return pastry.uc(x);
            });
    }
    function uncamelise (str, separator) {
        separator = separator || '_'; // default separator: _

        return str.replace(/([a-z])([A-Z])/g, function(_, a, b) {
            return a + separator + pastry.lc(b);
        });
    }
    function walk (obj, isUncamelise, separator) {
        /*
         * @NOTE: only the key strings will be transformed
         */
        if (!obj || !pastry.isObject(obj)) {
            return obj;
        }
        if (!obj || pastry.isDate(obj) || pastry.isRegExp(obj)) {
            return obj;
        }
        if (pastry.isArray(obj)) {
            return pastry.map(obj, function (value) {
                return walk(value, isUncamelise, separator);
            });
        }
        return pastry.reduce(pastry.keys(obj), function (acc, key) {
            var camel = isUncamelise ? uncamelise(key, separator) : camelise(key);
            acc[camel] = walk(obj[key], isUncamelise, separator);
            return acc;
        }, {});
    }

    return pastry.camelCase = {
        camelise: function (str) {
            if (pastry.isString(str)) {
                return camelise(str);
            }
            if (pastry.isObject(str)) {
                return walk(str);
            }
            return str;
        },
        uncamelise: function (str, separator) {
            if (pastry.isString(str)) {
                return uncamelise(str, separator);
            }
            if (pastry.isObject(str)) {
                return walk(str, true, separator);
            }
            return str;
        }
    };
});

