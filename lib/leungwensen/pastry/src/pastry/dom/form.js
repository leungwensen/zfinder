/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/dom/form', [
    'pastry/pastry',
    'pastry/dom/query',
    'pastry/url/querystring'
], function(
    pastry,
    domQuery,
    querystring
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : form utils
     */

    var
        map = pastry.map,

        getData = function (form) {
            form = domQuery.one(form);
            var resultObj         = {},
                elementArray      = [],
                rcheckableTypes   = /^(?:checkbox|radio)$/i,
                rsubmitterTypes   = /^(?:submit|button|image|reset|file)$/i,
                rsubmittableTypes = /^(?:input|select|textarea|keygen)/i;

            pastry.each(form.elements, function (elem) {
                elementArray.push(elem);
            });

            map(pastry.filter(elementArray, function (elem) {
                return elem.name                          &&
                    !elem.disabled                        &&
                    rsubmittableTypes.test(elem.nodeName) &&
                    !rsubmitterTypes.test(elem.type)      &&
                    (!rcheckableTypes.test(elem.type) || elem.checked);
            }), function (elem) {
                var val = elem.value;
                // if (val) {
                    if (pastry.isArray(val)) {
                        map(val, function (element) {
                            resultObj[element.name] = element.value;
                        });
                    } else {
                        resultObj[elem.name] = elem.value;
                    }
                // }
            });
            return resultObj;
        };

    return {
        /*
         * @description : return form data object.
         * @syntax      : pastry.Form.data(form)
         * @param       : {HTMLFormElement} form, form to be get data from.
         * @return      : {Object} form data object.
         */
        data: getData,
        /*
         * @description : return form data query string.
         * @syntax      : pastry.Form.serialize(form)
         * @param       : {HTMLFormElement} form, form to be get data query string from.
         * @return      : {String} form data query string.
         */
        serialize: function (form) {
            return querystring.stringify(getData(form));
        }
    };
});

