/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/data', [
    'pastry/dom/query',
    'pastry/dom/utils'
], function(
    domQuery,
    domUtils
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : dom dataSet related
     * @note        : if DataSet is supported, use DataSet
     */
    var dataSetStr = 'dataset',
        dataPrefix = 'data-',
        hasDataSet = domUtils.hasDataSet,
        domData;

    return domData = {
        get: function (node, name) {
            node = domQuery.one(node);
            if (hasDataSet) {
                return node[dataSetStr][name];
            }
            return node[dataPrefix + name];
        },
        set: function (node, name, value) {
            node = domQuery.one(node);
            if (hasDataSet) {
                node[dataSetStr][name] = value;
            } else {
                node[dataPrefix + name] = value;
            }
        }
    };
});

