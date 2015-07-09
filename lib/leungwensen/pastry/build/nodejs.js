/* jshint strict: true, undef: true, unused: true */
/* global exports, module, PASTRY_CONFIG */

(function (GLOBAL) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-07-07
     * @description : 定义全局命名空间以及核心函数库
     */

    GLOBAL = GLOBAL || {};

    if (GLOBAL.pastry) { // 避免重复运行
        return;
    }

    var
    // 命名空间 {
        pastry = {},
    // }
    // 局部变量 {
        A  = Array,
        F  = Function,
        O  = Object,
        S  = String,
        PS = 'prototype',
        US = 'undefined',
        AP = A[PS],
        FP = F[PS],
        // OP = O[PS],
        SP = S[PS],

        //noop = function () { },

        // helpers {
            toStr = {}.toString,
            slice = AP.slice,

            arrayFromSecondElement = function (arr) {
                return slice.call(arr, 1);
            },
            applyNativeFunction = function (nativeFunc, target, args) {
                return nativeFunc.apply(target, arrayFromSecondElement(args));
            },

            // isType() {
                isType = function (type, obj) {
                    return toStr.call(obj) === '[object ' + type + ']';
                },
                isArrayLike = pastry.isArrayLike = function (obj) {
                    return (typeof obj === 'object' && isFinite(obj.length));
                },
                isFunction = pastry.isFunction = function (obj) {
                    return isType('Function', obj);
                },
                isNumber = pastry.isNumber = function (obj) {
                    return isType('Number', obj);
                },
                isObject = pastry.isObject = function (obj) {
                    var type = typeof obj;
                    return type === 'function' || type === 'object' && !!obj;
                },
                isPlainObject = pastry.isPlainObject = function (obj) {
                    return isType('Object', obj);
                },
            // }

            toArray = pastry.toArray = function (obj) {
                return isArrayLike(obj) ? slice.call(obj) : [];
            },

            each,
            hasValue,
            uc;
        // }

    // }
    // // 版本号 {
    //     pastry.VERSION = '{VERSION}';
    // // }

    // ES5 && ES6 函数集 {
        pastry.index = function (up) {
            /*
             * @description: 为实现 indexOf 和 lastIndexOf 而设计的函数
             */
            return function (arr, searchElement, fromIndex) {
                var i,
                    len = arr.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                if (!fromIndex) {
                    fromIndex = up ? 0 : arr.length;
                } else if (fromIndex < 0) {
                    fromIndex = Math.max(0, arr.length + fromIndex);
                }
                if (up) {
                    for (i = fromIndex; i < arr.length; i++) {
                        if (arr[i] === searchElement) {
                            return i;
                        }
                    }
                } else {
                    for (i = fromIndex; i >= 0; i--) {
                        if (arr[i] === searchElement) {
                            return i;
                        }
                    }
                }
                return -1;
            };
        };
        pastry.indexOf = AP.indexOf ?
            /*
             * @description : 返回 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : pastry.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr) {
                return applyNativeFunction(AP.indexOf, arr, arguments);
            } : pastry.index(true);
        pastry.lastIndexOf = AP.lastIndexOf ?
            /*
             * @description : 返回最后一个 index （不存在则为 -1）
             * @parameter*  : {Array } arr           , 要遍历的数组
             * @parameter*  : {Object} searchElement , 要搜索的元素
             * @parameter   : {Number} fromIndex     , 起始 index
             * @return      : {Number} index
             * @syntax      : pastry.indexOf(arr, searchElement[, fromIndex])
             */
            function (arr) {
                return applyNativeFunction(AP.lastIndexOf, arr, arguments);
            } : pastry.index();

        function objForEach (obj, callback, thisObj) {
            for (var key in obj) {
                callback.call(thisObj, obj[key], key, obj);
            }
        }
        each = pastry.each = pastry.forEach = AP.forEach ?
            /*
             * @description : 遍历
             * @parameter*  : {Object  } obj      , 待循环变量
             * @parameter*  : {Function} callback , 回调函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @syntax      : pastry.each(obj Object, callback Function[, thisObj Object]);
             * @syntax      : pastry.forEach(obj Object, callback Function[, thisObj Object]);
             */
            function (obj, callback, thisObj) {
                if (isArrayLike(obj)) {
                    return applyNativeFunction(AP.forEach, obj, arguments);
                } else if (isPlainObject(obj)) {
                    objForEach(obj, callback, thisObj);
                }
                return obj;
            } : function (obj, callback, thisObj) {
                if (isArrayLike(obj)) {
                    var len = obj.length;
                    for (var i = 0; i < len; i++) {
                        if (i in obj) {
                            callback.call(thisObj, obj[i], i, obj);
                        }
                    }
                } else if (isPlainObject(obj)) {
                    objForEach(obj, callback, thisObj);
                }
                return obj;
            };

        pastry.eachReverse = function (arr, callback, thisObj) {
            /*
             * @description : 逆序遍历
             * @parameter*  : {Array   } arr      , 待循环数组
             * @parameter*  : {Function} callback , 回调函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @syntax      : pastry.eachReverse(arr Array, callback Function[, thisObj Object]);
             */
            if (arr) {
                var i = arr.length - 1;
                for (; i > -1; i -= 1) {
                    callback.call(thisObj, arr[i], i, arr);
                }
            }
            return arr;
        };

        pastry.every = AP.every ?
            /*
             * @description : 测试是否对于 arr 中的元素，callback 都返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 结果
             * @syntax      : pastry.every(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.every, arr, arguments);
            } : function (arr, callback, thisObj) {
                var i;
                for (i = 0; i < arr.length; i ++) {
                    if (!callback.call(thisObj, arr[i], i, arr)) {
                        return false;
                    }
                }
                return true;
            };

        pastry.filter = AP.filter ?
            /*
             * @description : 根据 callback 是否通过来过滤 arr 中的元素，返回过滤后的数组
             * @parameter*  : {Array   } arr      , 待过滤数组
             * @parameter*  : {Function} callback , 待运行函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : pastry.filter(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.filter, arr, arguments);
            } : function (arr, callback, thisObj) {
                var res = [];
                each(arr, function (element, key) {
                    if (callback.call(thisObj, element, key, arr)) {
                        res.push(element);
                    }
                });
                return res;
            };

        pastry.map = AP.map ?
            /*
             * @description : 用 arr 通过 callback 函数加工各个元素得到新的数组
             * @parameter*  : {Array   } arr      , 待加工数组
             * @parameter*  : {Function} callback , 加工函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Array   } 结果数组
             * @syntax      : pastry.map(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.map, arr, arguments);
            } : function (arr, callback, thisObj) {
                var res = [];
                each(arr, function (element, key) {
                    res.push(callback.call(thisObj, element, key, arr));
                });
                return res;
            };

        pastry.some = AP.some ?
            /*
             * @description : 测试 arr 中每个元素，当有真的时候退出并返回 true
             * @parameter*  : {Array   } arr      , 待测试数组
             * @parameter*  : {Function} callback , 测试函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Boolean } 真值
             * @syntax      : pastry.some(arr, callback[, thisObj])
             */
            function (arr) {
                return applyNativeFunction(AP.some, arr, arguments);
            } : function (arr, callback, thisObj) {
                var i;
                for (i = 0; i < arr.length; i ++) {
                    if (callback.call(thisObj, arr[i], i, arr)) {
                        return true;
                    }
                }
                return false;
            };

        pastry.reduce = AP.reduce ?
            /*
             * @description : 从左到右遍历数组，运行函数并得到最终值
             * @parameter*  : {Array   } arr      , 待遍历数组
             * @parameter*  : {Function} callback , 遍历用函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Object  } 结果对象
             * @syntax      : pastry.reduce(arr, callback[, thisObj])
            // @paramForCallback* : {Object  } previousValue , 前一个值
            // @paramForCallback* : {Object  } currentValue  , 当前值
            // @paramForCallback  : {Number  } index         , index
            // @paramForCallback  : {Array   } array         , 数组变量
             */
            function (arr) {
                return applyNativeFunction(AP.reduce, arr, arguments);
            } : function (arr, callback, thisObj) {
                var i, value;
                if (thisObj) {
                    value = thisObj;
                }
                for (i = 0; i < arr.length; i ++) {
                    if (value) {
                        value = callback(value, arr[i], i, arr);
                    } else {
                        value = arr[i];
                    }
                }
                return value;
            };
        pastry.reduceRight = AP.reduceRight ?
            /*
             * @description : 从右到左遍历数组，运行函数并得到最终值
             * @parameter*  : {Array   } arr      , 待遍历数组
             * @parameter*  : {Function} callback , 遍历用函数
             * @parameter   : {Object  } thisObj  , 上下文变量
             * @return      : {Object  } 结果对象
             * @syntax      : pastry.reduce(arr, callback[, thisObj])
            // @paramForCallback* : {Object  } previousValue , 前一个值
            // @paramForCallback* : {Object  } currentValue  , 当前值
            // @paramForCallback  : {Number  } index         , index
            // @paramForCallback  : {Array   } array         , 数组变量
             */
            function (arr) {
                return applyNativeFunction(AP.reduceRight, arr, arguments);
            } : function (arr, callback, thisObj) {
                var i, value;
                if (thisObj) {
                    value = thisObj;
                }
                for (i = arr.length - 1; i >= 0; i --) {
                    if (value) {
                        value = callback(value, arr[i], i, arr);
                    } else {
                        value = arr[i];
                    }
                }
                return value;
            };

        pastry.trim = SP.trim ?
            /*
             * @description : 移除空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : pastry.trim(str)
             */
            function (str) {
                return str.trim();
            } : function (str) {
                return str.replace(/^\s+|\s+$/g, '');
            };
        pastry.trimLeft = SP.trimLeft ?
            /*
             * @description : 移除左空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : pastry.trimLeft(str)
             */
            function (str) {
                return str.trimLeft();
            } : function (str) {
                return str.replace(/^\s+/g, '');
            };
        pastry.trimRight = SP.trimRight ?
            /*
             * @description : 移除右空白子串
             * @parameter*  : {string} str, 待处理字符串
             * @return      : {string} 结果字符串
             * @syntax      : pastry.trimRight(str)
             */
            function (str) {
                return str.trimRight();
            } : function (str) {
                return str.replace(/\s+$/g, '');
            };
    // }
    // helper 函数集 {
        // 类型转换 {
            pastry.toInt = function (str, base) {
                return parseInt(str, base || 10);
            };
        // }
        // 字符串相关 {
            pastry.lc = function (str) {
                /*
                 * @syntax: pastry.lc(str String);
                 */
                return (str + '').toLowerCase();
            };
            uc = pastry.uc = function (str) {
                /*
                 * @syntax: pastry.uc(str String);
                 */
                return (str + '').toUpperCase();
            };
            pastry.hasSubString = function (str, subStr) {
                /*
                 * @syntax: pastry.hasSubString(str String, subStr String);
                 */
                return (str.indexOf(subStr) > -1);
            };
            pastry.capitalize = function (str) {
                str = str + '';
                return uc(str.charAt(0)) + str.substr(1);
            };
        // }
        // 其它类型判断 pastry.is$Type(obj) {
            /*
             * @description : 类型判断
             * @parameter*  : {Any} obj, 待判断对象
             * @syntax      : pastry.is$Type(obj Any);
             */
            each([
                'Array',
                'Arguments',
                'Boolean',
                'Date',
                'Error',
                'RegExp',
                'String'
            ], function (type) {
                pastry['is' + type] = function (obj) {
                    return isType(type, obj);
                };
            });
            if (A.isArray) {
                pastry.isArray = A.isArray;
            }
            pastry.isNaN = function (obj) {
                return isNumber(obj) && obj !== +obj;
            };
            pastry.isFinite = function (obj) {
                return isNumber(obj) && isFinite(obj) && !isNaN(obj);
            };
            pastry.isUndefined = function (obj) {
                return obj === undefined;
            };
            pastry.isNull = function (obj) {
                return obj === null;
            };
        // }
        // 数组、对象相关 {
            pastry.range = function (start, stop, step) {
                if (arguments.length <= 1) {
                    stop = start || 0;
                    start = 0;
                }
                step = step || 1;

                var length = Math.max(Math.ceil((stop - start) / step), 0),
                    range  = new Array(length),
                    idx    = 0;
                for (; idx < length; idx++, start += step) {
                    range[idx] = start;
                }
                return range;
            };
            pastry.flatten = function (array) {
                /*
                 * @description: 扁平化二维数组
                 */
                array = array || [];
                for (var r = [], i = 0, l = array.length; i < l; ++i) {
                    if (isArrayLike(array[i])) {
                        r = r.concat(array[i]);
                    } else {
                        r[r.length] = array[i];
                    }
                }
                return r;
            };
            pastry.merge = function (dest) {
                /*
                 * @description : 合并对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : pastry.merge(dest Object[, src1 Object, src2 Object, ...]);
                 */
                each(arrayFromSecondElement(arguments), function (source) {
                    if (source) {
                        for (var prop in source) {
                            if (toStr.call(source[prop]) !== toStr.call(dest[prop])) {
                                dest[prop] = source[prop];
                            } else {
                                if (isPlainObject(source[prop])) {
                                    dest[prop] = dest[prop] || {};
                                    pastry.merge(dest[prop], source[prop]);
                                } else {
                                    dest[prop] = source[prop];
                                }
                            }
                        }
                    }
                });
                return dest;
            };
            pastry.extend = function (dest) {
                /*
                 * @description : 扩展对象
                 * @parameter*  : {Object} dest, 目标对象
                 * @syntax      : pastry.extend(dest Object[, src1 Object, src2 Object, ...]);
                 */
                each(arrayFromSecondElement(arguments), function (source) {
                    if (source) {
                        for (var prop in source) {
                            dest[prop] = source[prop];
                        }
                    }
                });
                return dest;
            };
            pastry.remove = function (arr, fromIndex, toIndex) {
                /*
                 * @description : 删除数组元素
                 * @parameter*  : {Array } arr       , 待处理数组
                 * @parameter   : {Number} fromIndex , 起始 index
                 * @parameter   : {Number} toIndex   , 结束 index
                 * @syntax      : pastry.remove(arr, [fromIndex[, toIndex]])
                 */
                var rest,
                    len = arr.length;
                if (!isNumber(fromIndex)) {
                    return arr;
                }
                rest = arr.slice((toIndex || fromIndex) + 1 || len);
                arr.length = fromIndex < 0 ? len + fromIndex : fromIndex;
                return arr.push.apply(arr, rest);
            };
            pastry.keys = O.keys ?
                /*
                 * @description : 获取对象键集合
                 * @parameter*  : {object} obj, 对象
                 * @syntax      : pastry.keys(obj)
                 */
                function (obj) {
                    return O.keys(obj);
                } : function (obj) {
                    var result = [];
                    if (isFunction(obj)) {
                        each(obj, function (value, key) {
                            if (key !== PS) {
                                result.push(key);
                            }
                        });
                    } else {
                        each(obj, function (value, key) {
                            result.push(key);
                        });
                    }
                    return result;
                };
            pastry.invert = function(obj) {
                var result = {};
                each(obj, function (value, key) {
                    result[value] = key;
                });
                return result;
            };
            pastry.values = function (obj) {
                /*
                 * @description : 获取对象值集合
                 * @parameter*  : {object} obj, 对象
                 * @syntax      : pastry.values(obj)
                 */
                var values = [];
                each(obj, function (value) {
                    values.push(value);
                });
                return values;
            };
            pastry.hasKey = function (obj, key) {
                /*
                 * @description : 检查是否存在键
                 * @parameter*  : {Object} obj, 待检查对象
                 * @parameter*  : {String} key, 键
                 * @syntax      : pastry.hasKey(obj, key)
                 */
                return obj.hasOwnProperty(key);
            };
            hasValue = pastry.hasValue = function (obj, value) {
                /*
                 * @description : 检查是否存在值
                 * @parameter*  : {Object} obj   , 待检查对象
                 * @parameter*  : {String} value , 值
                 * @syntax      : pastry.hasValue(obj, value)
                 */
                return (pastry.indexOf(pastry.values(obj), value) > -1);
            };
            pastry.uniq = function (arr) {
                /*
                 * @description : 求集合
                 * @parameter*  : {Array} arr, 求集合数组
                 * @syntax      : pastry.uniq(arr Array);
                 */
                var resultArr = [];
                each(arr, function (element) {
                    if (!hasValue(resultArr, element)) {
                        resultArr.push(element);
                    }
                });
                return resultArr;
            };
            pastry.union = function (/*arr1, arr2 */) {
                /*
                 * @description : 合集
                 * @parameter*  : {Array} arr1, 求合集数组
                 * @syntax      : pastry.union([arr1 Array, arr2 Array, ...]);
                 */
                var resultArr = [],
                    sourceArrs = toArray(arguments);
                each(sourceArrs, function (arr) {
                    resultArr.concat(arr);
                });
                return pastry.uniq(resultArr);
            };
            pastry.difference = function (arr) {
                var rest = pastry.flatten(arrayFromSecondElement(arguments));
                return pastry.filter(arr, function(value){
                    return !hasValue(rest, value);
                });
            };
            pastry.intersect = function (a, b) {
                var result = [];
                each(a, function (value) {
                    if (hasValue(b, value)) {
                        result.push(value);
                    }
                });
                return result;
            };
            pastry.destroy = function (obj) {
                /*
                 * @description : 销毁对象
                 * @parameter*  : {Object} obj, 待销毁对象
                 * @syntax      : pastry.destroy(obj);
                 */
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        delete obj[p];
                    }
                }
                obj.prototype = obj['__proto__'] = null;
                obj = null;
            };
            pastry.clone = function (obj) {
                /*
                 * @description : 克隆对象
                 * @parameter*  : {Object} obj, 待克隆对象
                 * @syntax      : pastry.clone(obj);
                 */
                if (!isObject(obj)) {
                    return obj;
                }
                return isArrayLike(obj) ? toArray(obj) : pastry.extend({}, obj);
            };
        // }
        // 函数相关 {
            pastry.bind = FP.bind ?
                /*
                 * @description : 绑定函数运行上下文
                 * @parameter*  : {Function} func, 目标函数
                 * @parameter*  : {Object  } oThis, 上下文
                 * @syntax      : pastry.bind(func Function, oThis Object);
                 */
                function (func) {
                    return applyNativeFunction(FP.bind, func, arguments);
                } : function (func, oThis) {
                    if (isFunction(oThis) && isFunction(func)) {
                        var aArgs  = toArray(arguments).slice(2),
                            FNOP   = function () {},
                            fBound = function () {
                                return func.apply(
                                    this instanceof FNOP && oThis ? this : oThis || GLOBAL,
                                    aArgs.concat(arguments)
                                );
                            };
                        FNOP[pastry]   = func[pastry];
                        fBound[pastry] = new FNOP();
                        return fBound;
                    }
                };
        // }
        // 其它 {
            pastry.getAny = function () {
                /*
                 * @description : 从一系列 callback 函数里按顺序尝试取值，并返回第一个可用值
                 * @parameter*  : {Array} callbackList, 回调函数列表
                 * @syntax      : pastry.getAny([func1 Function, func2 Function, ...]);
                 */
                var i, returnValue,
                    callbackList = pastry.flatten(toArray(arguments));
                for (i = 0; i < callbackList.length; i ++) {
                    try {
                        returnValue = callbackList[i]();
                        break;
                    } catch (e) {
                    }
                }
                return returnValue;
            };
            pastry.uuid = function (prefix) {
                /*
                 * @description : 生成uuid
                 * @parameter   : {String} prefix, 前缀
                 * @syntax      : pastry.uuid(prefix String);
                 */
                prefix = prefix || '';
                return prefix + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                    .replace(/[xy]/g, function (c) {
                        var r = Math.random()*16|0,
                            v = (c === 'x') ? r : (r&0x3|0x8),
                            result = v.toString(16);
                        return result;
                    });
            };
        // }
    // }
    // 增加 pastry 函数 {
        /*
         * @description : 把对象中的属性／方法加到 pastry 这个 namespace 下
         * @parameter   : {Object } obj, 扩展对象
         * @parameter   : {Boolean} override, 是否覆盖
         * @syntax      : pastry.mixin(obj Object[, override Boolean]);
         */
        pastry.mixin = function (obj, override) {
            each(obj, function (value, key) {
                if (pastry[key] && !override) {
                    throw 'pastry.' + key + ' already exists';
                } else {
                    pastry[key] = value;
                }
            });
        };
    // }
    // 输出全局变量 {
        pastry.setGLOBAL = function (key, value) {
            /*
             * @description : 设置全局变量
             * @parameter   : {String} key, 变量名
             * @parameter   : {Any   } value, 值
             * @syntax      : pastry.setGLOBAL(key String, value Any);
             */
            if (typeof exports !== US) {
                exports[key] = value;
            }
            GLOBAL[key] = value;
        };
        each([
            'P',
            'pastry',
            'PASTRY'
        ], function (alias) {
            // set global names and alias
            pastry.setGLOBAL(alias, pastry);
        });

        if (typeof exports !== US) {
            if (typeof module !== US && module.exports) {
                module.exports = pastry;
            }
        }
    // }
    // 配置项 {
        pastry.CONFIG = pastry.merge({
            defaultLocale: 'en_us',
            locale: 'en_us'
        }, (typeof PASTRY_CONFIG !== 'undefined' ? PASTRY_CONFIG : {}));
    // }
}(this));


/* jshint strict: true, undef: true, unused: true */
// /* global xxx, yyy */

(function (GLOBAL) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-11-10
     * @description : event 模块，包括全局和局部的
     */

    var pastry = GLOBAL.pastry,

        // defination of event function {
            event = function (target) {
                target = target || this;

                var events = target._events = {}; // all events stores in the the collection: *._events

                target.on = function (name, callback, context) {
                    /*
                     * @description: 绑定事件
                     */
                    var list = events[name] || (events[name] = []);
                    list.push({
                        callback : callback,
                        context  : context
                    });
                    return target;
                };
                target.off = function (name, callback) {
                    /*
                     * @description: 解绑事件
                     */
                    if (!name) {
                        events = {};
                    }
                    var list = events[name] || [],
                        i = list.length;
                    if (!callback) {
                        list = [];
                    } else {
                        while (i > 0) {
                            i --;
                            if (list[i].callback === callback) {
                                list.splice(i, 1);
                            }
                        }
                    }
                    return target;
                };
                target.emit = function () {
                    /*
                     * @description: 触发事件
                     */
                    var args = pastry.toArray(arguments),
                        list = events[args.shift()] || [];
                    pastry.each(list, function (evt) {
                        if (!evt.callback) {
                            console.error(evt, list);
                            throw 'event callback is not defined';
                        }
                        evt.callback.apply(evt.context, args);
                    });
                    return target;
                };
                target.trigger = target.emit; // alias
                return target;
            };
        // }

    // add on(), off(), emit(), trigger() to pastry {
        event(pastry);
    // }
    // add .event to pastry {
        pastry.event = event;
    // }
}(this));


/* jshint strict: true, undef: true, unused: true */
// /* global */

var define;

(function (GLOBAL, undef) {
    'use strict';
    /*
     * @author      : wensen.lws
     * @description : 模块加载
     * @note        : 和 seajs、requirejs 的不同之一：define 的模块即时运行
     */
    if (define) { // 避免反复执行以及和其它模块加载器冲突
        return;
    }

    var pastry = GLOBAL.pastry,

        event = pastry.event,

        each = pastry.each,

        Module = function (meta) {
            /*
             * @description: 模块构造函数
             */
            var mod = this;
            mod.initialise(meta);
            return mod;
        },

        // 缓存数据 {
            data = Module._data = {},

            moduleByUri   = data.moduleByUri   = {},
            exportsByUri  = data.exportsByUri  = {},
            executedByUri = data.executedByUri = {},
            queueByUri    = data.queueByUri    = {}, // 模块执行队列
        // }

        require;

    event(Module); // 加上事件相关函数: on(), off(), emit(), trigger()

    Module.prototype = {
        initialise: function (meta) {
            /*
             * @description: 初始化
             */
            var mod = this,
                id,
                uri,
                relativeUri;
            pastry.extend(mod, meta);
            Module.emit('module-initialised', mod);
            if (uri = mod.uri) {
                if (!moduleByUri[uri]) {
                    moduleByUri[uri] = mod;
                }
                if (!queueByUri[uri]) {
                    queueByUri[uri] = mod;
                }
            }
            if (id = mod.id) {
                if (!moduleByUri[id]) {
                    moduleByUri[id] = mod;
                }
            }
            if (relativeUri = mod.relativeUri) {
                if (!moduleByUri[relativeUri]) {
                    moduleByUri[relativeUri] = mod;
                }
                if (!queueByUri[relativeUri]) {
                    queueByUri[mod.relativeUri] = mod;
                }
            }
            return mod;
        },
        processDeps: function () {
            var mod = this;
            Module.emit('module-depsProcessed', mod);
            return mod;
        },
        execute: function () {
            var mod           = this,
                depModExports = [];
            if ('exports' in mod) {
                delete queueByUri[mod.uri];
                delete queueByUri[mod.relativeUri];
                return mod;
            }

            if (pastry.every(mod.deps, function (uri) {
                return !!executedByUri[uri];
            })) {
                var modFactory     = mod.factory,
                    modUri         = mod.uri,
                    modId          = mod.id,
                    modRelativeUri = mod.relativeUri;

                each(mod.deps, function (uri) {
                    depModExports.push(exportsByUri[uri]);
                });
                mod.exports =
                    exportsByUri[modUri] =
                    exportsByUri[modId] =
                    exportsByUri[modRelativeUri] = pastry.isFunction(modFactory) ?
                        modFactory.apply(undef, depModExports) : modFactory;
                executedByUri[modUri] =
                    executedByUri[modId] =
                    executedByUri[modRelativeUri] = true;
                delete queueByUri[modUri];
                Module.emit('module-executed', mod);
            }
            return mod;
        }
    };

    Module.on('module-executed', function () {
        /*
         * @description : 执行所有依赖于该模块的模块
         * @note        : hacking so hard
         */
        each(queueByUri, function (mod2BeExecuted/*, uri */) {
            if (mod2BeExecuted instanceof Module) {
                mod2BeExecuted.execute();
            }
        });
    });

    define = GLOBAL.define = Module.define = function (/* id, deps, factory */) {
        // 解释参数 {
            var args    = pastry.toArray(arguments),
                id      = pastry.isString(args[0]) ? args.shift() : undef,
                deps    = args.length > 1 ? args.shift() : [],
                factory = args[0],
                meta = {
                    id      : id,
                    uri     : id,
                    deps    : deps,
                    factory : factory
                },
                mod;
        // }
        // 需要对元数据进行处理就绑定这个事件 {
            Module.emit('module-metaGot', meta);
        // }
        // 新建实例、保存并且即时运行 {
            mod = new Module(meta)
                .processDeps()
                .execute();
        // }
        // define事件 {
            Module.emit('module-defined', mod);
        // }
    };

    define.amd = {}; // 最小 AMD 实现

    require = define; // 即时运行，require 和 define 等价

    // 核心模块定义 {
        define('pastry/Module', function () {
            return Module;
        });
        define('pastry/pastry', function () {
            return pastry;
        });
        define('pastry/event/event', function () {
            return pastry.event;
        });
    // }
    // 输出 require 函数 {
        pastry.setGLOBAL('require' , require);
    // }
}(this));

/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/sprintf', [
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - sprintf
     */

    var reg = /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([%bcdfosxX])/g,

        isUndefined = pastry.isUndefined,
        some = pastry.some,
        abs = Math.abs,
        toInt = pastry.toInt,

        sprintf = function (format) {
            if (!pastry.isString(format)) {
                throw 'sprintf: The first arguments need to be a valid format string.';
            }

            var part,
                parts = [],
                paramIndex = 1,
                args = pastry.toArray(arguments);

            while (part = reg.exec(format)) {
                if ((paramIndex >= args.length) && (part[8] !== '%')) {
                    throw 'sprintf: At least one argument was missing.';
                }

                parts[parts.length] = {
                    begin: part.index,
                    end: part.index + part[0].length,
                    sign: (part[1] === '+'),
                    negative: (parseFloat(args[paramIndex]) < 0) ? true : false,
                    padding: (isUndefined(part[2])) ? (' ') : ((part[2].substring(0, 1) === "'") ? (part[3]) : (part[2])),
                    alignLeft: (part[4] === '-'),
                    width: (!isUndefined(part[5])) ? part[5] : false,
                    precision: (!isUndefined(part[7])) ? part[7] : false,
                    type: part[8],
                    data: (part[8] !== '%') ? String(args[paramIndex++]) : false
                };
            }

            var i, j, preSubStr, origLength,
                newString = '',
                start     = 0;

            for (i = 0; i < parts.length; i ++) {
                newString += format.substring(start, parts[i].begin);

                start = parts[i].end;

                preSubStr = '';
                switch (parts[i].type) {
                    case '%':
                        preSubStr = '%';
                        break;
                    case 'b':
                        preSubStr = abs(toInt(parts[i].data)).toString(2);
                        break;
                    case 'c':
                        preSubStr = String.fromCharCode(abs(toInt(parts[i].data)));
                        break;
                    case 'd':
                        preSubStr = String(abs(toInt(parts[i].data)));
                        break;
                    case 'f':
                        preSubStr = (parts[i].precision === false) ?
                            (String((abs(parseFloat(parts[i].data))))) :
                            (abs(parseFloat(parts[i].data)).toFixed(parts[i].precision));
                        break;
                    case 'o':
                        preSubStr = abs(toInt(parts[i].data)).toString(8);
                        break;
                    case 's':
                        preSubStr = parts[i].data.substring(0, parts[i].precision ? parts[i].precision : parts[i].data.length);
                        break;
                    case 'x':
                        preSubStr = abs(toInt(parts[i].data)).toString(16).toLowerCase();
                        break;
                    case 'X':
                        preSubStr = abs(toInt(parts[i].data)).toString(16).toUpperCase();
                        break;
                    default:
                        throw 'sprintf: Unknown type "' + parts[i].type + '" detected. This should never happen. Maybe the regex is wrong.';
                }

                if (parts[i].type === '%') {
                    newString += preSubStr;
                    continue;
                }

                if (parts[i].width !== false) {
                    if (parts[i].width > preSubStr.length) {
                        origLength = preSubStr.length;
                        for(j = 0; j < parts[i].width - origLength; ++j) {
                            preSubStr = (parts[i].alignLeft === true) ?
                                (preSubStr + parts[i].padding) :
                                (parts[i].padding + preSubStr);
                        }
                    }
                }

                /*jshint -W083 */ // make function in loop
                if (
                    some([
                        'b',
                        'd',
                        'o',
                        'f',
                        'x',
                        'X'
                    ], function(type) {
                        return type === parts[i].type;
                    })
                ) {
                    if (parts[i].negative === true) {
                        preSubStr = '-' + preSubStr;
                    } else if (parts[i].sign === true) {
                        preSubStr = '+' + preSubStr;
                    }
                }
                newString += preSubStr;
            }

            newString += format.substring(start, format.length);
            return newString;
        };

    return pastry.sprintf = sprintf;
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/vsprintf', [
    'pastry/pastry',
    'pastry/fmt/sprintf'
], function (
    pastry,
    sprintf
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-29
     * @description : fmt 模块 - vsprintf
     */
    var vsprintf = function (fmt, argv) {
        argv.unshift(fmt);
        return sprintf.apply(null, argv);
    };

    return pastry.vsprintf = vsprintf;
});


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


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/color/hexByName', [
], function(
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : 颜色 rgb 值列表
     */

    var named = {
        "aliceblue"            : "#f0f8ff",
        "antiquewhite"         : "#faebd7",
        "aqua"                 : "#00ffff",
        "aquamarine"           : "#7fffd4",
        "azure"                : "#f0ffff",
        "beige"                : "#f5f5dc",
        "bisque"               : "#ffe4c4",
        "black"                : "#000000",
        "blanchedalmond"       : "#ffebcd",
        "blue"                 : "#0000ff",
        "blueviolet"           : "#8a2be2",
        "brown"                : "#a52a2a",
        "burlywood"            : "#deb887",
        "burntsienna"          : "#ea7e5d",
        "cadetblue"            : "#5f9ea0",
        "chartreuse"           : "#7fff00",
        "chocolate"            : "#d2691e",
        "coral"                : "#ff7f50",
        "cornflowerblue"       : "#6495ed",
        "cornsilk"             : "#fff8dc",
        "crimson"              : "#dc143c",
        "cyan"                 : "#00ffff",
        "darkblue"             : "#00008b",
        "darkcyan"             : "#008b8b",
        "darkgoldenrod"        : "#b8860b",
        "darkgray"             : "#a9a9a9",
        "darkgreen"            : "#006400",
        "darkgrey"             : "#a9a9a9",
        "darkkhaki"            : "#bdb76b",
        "darkmagenta"          : "#8b008b",
        "darkolivegreen"       : "#556b2f",
        "darkorange"           : "#ff8c00",
        "darkorchid"           : "#9932cc",
        "darkred"              : "#8b0000",
        "darksalmon"           : "#e9967a",
        "darkseagreen"         : "#8fbc8f",
        "darkslateblue"        : "#483d8b",
        "darkslategray"        : "#2f4f4f",
        "darkslategrey"        : "#2f4f4f",
        "darkturquoise"        : "#00ced1",
        "darkviolet"           : "#9400d3",
        "deeppink"             : "#ff1493",
        "deepskyblue"          : "#00bfff",
        "dimgray"              : "#696969",
        "dimgrey"              : "#696969",
        "dodgerblue"           : "#1e90ff",
        "firebrick"            : "#b22222",
        "floralwhite"          : "#fffaf0",
        "forestgreen"          : "#228b22",
        "fuchsia"              : "#ff00ff",
        "gainsboro"            : "#dcdcdc",
        "ghostwhite"           : "#f8f8ff",
        "gold"                 : "#ffd700",
        "goldenrod"            : "#daa520",
        "gray"                 : "#808080",
        "green"                : "#008000",
        "greenyellow"          : "#adff2f",
        "grey"                 : "#808080",
        "honeydew"             : "#f0fff0",
        "hotpink"              : "#ff69b4",
        "indianred"            : "#cd5c5c",
        "indigo"               : "#4b0082",
        "ivory"                : "#fffff0",
        "khaki"                : "#f0e68c",
        "lavender"             : "#e6e6fa",
        "lavenderblush"        : "#fff0f5",
        "lawngreen"            : "#7cfc00",
        "lemonchiffon"         : "#fffacd",
        "lightblue"            : "#add8e6",
        "lightcoral"           : "#f08080",
        "lightcyan"            : "#e0ffff",
        "lightgoldenrodyellow" : "#fafad2",
        "lightgray"            : "#d3d3d3",
        "lightgreen"           : "#90ee90",
        "lightgrey"            : "#d3d3d3",
        "lightpink"            : "#ffb6c1",
        "lightsalmon"          : "#ffa07a",
        "lightseagreen"        : "#20b2aa",
        "lightskyblue"         : "#87cefa",
        "lightslategray"       : "#778899",
        "lightslategrey"       : "#778899",
        "lightsteelblue"       : "#b0c4de",
        "lightyellow"          : "#ffffe0",
        "lime"                 : "#00ff00",
        "limegreen"            : "#32cd32",
        "linen"                : "#faf0e6",
        "magenta"              : "#ff00ff",
        "maroon"               : "#800000",
        "mediumaquamarine"     : "#66cdaa",
        "mediumblue"           : "#0000cd",
        "mediumorchid"         : "#ba55d3",
        "mediumpurple"         : "#9370db",
        "mediumseagreen"       : "#3cb371",
        "mediumslateblue"      : "#7b68ee",
        "mediumspringgreen"    : "#00fa9a",
        "mediumturquoise"      : "#48d1cc",
        "mediumvioletred"      : "#c71585",
        "midnightblue"         : "#191970",
        "mintcream"            : "#f5fffa",
        "mistyrose"            : "#ffe4e1",
        "moccasin"             : "#ffe4b5",
        "navajowhite"          : "#ffdead",
        "navy"                 : "#000080",
        "oldlace"              : "#fdf5e6",
        "olive"                : "#808000",
        "olivedrab"            : "#6b8e23",
        "orange"               : "#ffa500",
        "orangered"            : "#ff4500",
        "orchid"               : "#da70d6",
        "palegoldenrod"        : "#eee8aa",
        "palegreen"            : "#98fb98",
        "paleturquoise"        : "#afeeee",
        "palevioletred"        : "#db7093",
        "papayawhip"           : "#ffefd5",
        "peachpuff"            : "#ffdab9",
        "peru"                 : "#cd853f",
        "pink"                 : "#ffc0cb",
        "plum"                 : "#dda0dd",
        "powderblue"           : "#b0e0e6",
        "purple"               : "#800080",
        "rebeccapurple"        : "#663399",
        "red"                  : "#ff0000",
        "rosybrown"            : "#bc8f8f",
        "royalblue"            : "#4169e1",
        "saddlebrown"          : "#8b4513",
        "salmon"               : "#fa8072",
        "sandybrown"           : "#f4a460",
        "seagreen"             : "#2e8b57",
        "seashell"             : "#fff5ee",
        "sienna"               : "#a0522d",
        "silver"               : "#c0c0c0",
        "skyblue"              : "#87ceeb",
        "slateblue"            : "#6a5acd",
        "slategray"            : "#708090",
        "slategrey"            : "#708090",
        "snow"                 : "#fffafa",
        "springgreen"          : "#00ff7f",
        "steelblue"            : "#4682b4",
        "tan"                  : "#d2b48c",
        "teal"                 : "#008080",
        "thistle"              : "#d8bfd8",
        "tomato"               : "#ff6347",
        "turquoise"            : "#40e0d0",
        "violet"               : "#ee82ee",
        "wheat"                : "#f5deb3",
        "white"                : "#ffffff",
        "whitesmoke"           : "#f5f5f5",
        "yellow"               : "#ffff00",
        "yellowgreen"          : "#9acd32"
    };

    return named;
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/oop/c3mro', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : description
     */
    var indexOf = pastry.indexOf;

    function cloneArray (arr) {
        return arr.slice(0);
    }
    function isGoodHead (head, rest) {
        var isGood = true;
        pastry.some(rest, function (lin) {
            if (indexOf(lin, head) > 0) {
                isGood = false;
            }
        });

        if (isGood) {
            pastry.each(rest, function (lin) {
                if (indexOf(lin, head) === 0) {
                    lin.shift();
                }
            });
        }
        return isGood;
    }
    function eachHead (bases) {
        var result = [],
            badLinearization = 0;

        while (bases.length) {
            var base = bases.shift();
            if (!base.length) {
                continue;
            }

            if (isGoodHead(base[0], bases)) {
                result.push(base.shift());
                badLinearization = 0;
            } else {
                badLinearization += 1;
                if (badLinearization === bases.length) {
                    throw 'Bad Linearization';
                }
            }
            if (base.length) {
                bases.push(base);
            }
        }
        return result;
    }

    return pastry.c3mroMerge = function () {
        var bases = pastry.map(pastry.toArray(arguments), cloneArray);
        return eachHead(bases);
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/oop/declare', [
    'pastry/pastry',
    'pastry/oop/c3mro'
], function(
    pastry,
    c3mroMerge
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : Class utils
     */

    return pastry.declare = function(/*name, superClasses, protoObj*/) {
        var uberClass,
            tempConstructor,
            lin          = '_linearization',
            args         = pastry.toArray(arguments),
            name         = pastry.isString(args[0]) ? args.shift() : '',
            superClasses = args.length > 1 ? args.shift() : [],
            protoObj     = args[0] ? args.shift() : {},
            bases        = [],
            Tmp          = function () {},
            hasCtor      = false,
            ctor         = function () {};

        superClasses = pastry.isArray(superClasses) ? superClasses : [superClasses];
        pastry.each(superClasses, function(clazz) {
            clazz[lin] = clazz[lin] || [clazz];
            bases.push(clazz[lin]);
        });

        if (bases.length) {
            bases.push(superClasses);
            bases = c3mroMerge.apply(null, bases);
        }

        tempConstructor = protoObj.constructor;
        if (tempConstructor !== Object.prototype.constructor) {
            hasCtor = true;
            ctor = tempConstructor;
        }

        ctor[lin]    = [ctor].concat(bases);
        ctor.parents = bases.slice(0);

        protoObj.constructor = ctor;
        while ((uberClass = bases.shift())) {
            protoObj = pastry.extend({}, uberClass.prototype, protoObj);
            Tmp.prototype = protoObj;
            if (!hasCtor) {
                protoObj.constructor = ctor;
            }
            protoObj = new Tmp();
        }

        ctor.className = name;
        ctor.prototype = protoObj;
        ctor.prototype.constructor = ctor;

        return ctor;
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/color/Color', [
    'pastry/pastry',
    'pastry/color/hexByName',
    'pastry/oop/declare'
], function(
    pastry,
    hexByName,
    declare
) {
    'use strict';
    /*
     * @author      : 绝云
     * @description : 颜色构造函数
     * @note        : can be used in nodejs
     */
    var lc    = pastry.lc,
        round = Math.round,

        initProps = {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        },

        Color = function (/*Array|String|Object*/ color) {
            var instance = this;

            if (color) {
                instance.initialise(color);
            }
        },

        classMaker;

    pastry.extend(Color, {
        hexByName: hexByName,

        makeGrey: function (/*Number*/ g, /*Number?*/ a) {
            return Color.fromArray([g, g, g, a]);
        },

        blendColors : function(/*Color*/ start, /*Color*/ end, /*Number*/ weight, /*Color?*/ obj){
            var t = obj || new Color();
            pastry.each(['r', 'g', 'b', 'a'], function(x){
                t[x] = start[x] + (end[x] - start[x]) * weight;
                if (x !== 'a') {
                    t[x] = Math.round(t[x]);
                }
            });
            return t.sanitize();
        },

        fromHex: function (/*String*/ color, /*Color?*/ obj) {
            var result = obj || new Color(),
                bits   = (color.length === 4) ? 4 : 8,
                mask   = (1 << bits) - 1;

            color = Number('0x' + color.substr(1));

            if (pastry.isNaN(color)) {
                return null;
            }
            pastry.each(['b', 'g', 'r'], function (x) {
                var c = color & mask;
                color >>= bits;
                result[x] = bits === 4 ? 17 * c : c;
            });
            result.a = 1;
            return result;
        },
        fromRgb: function (/*String*/ color, /*Color?*/ obj) {
            var matches = lc(color).match(/^rgba?\(([\s\.,0-9]+)\)/);
            return matches && Color.fromArray(matches[1].split(/\s*,\s*/), obj);
        },
        fromHsl: function (/*String*/ color, /*Color?*/ obj) {
            var matches = lc(color).match(/^hsla?\(([\s\.,0-9]+)\)/);
            if (matches) {
                var c  = matches[2].split(/\s*,\s*/),
                    l  = c.length,
                    H  = ((parseFloat(c[0]) % 360) + 360) % 360 / 360,
                    S  = parseFloat(c[1]) / 100,
                    L  = parseFloat(c[2]) / 100,
                    m2 = L <= 0.5 ? L * (S + 1) : L + S - L * S,
                    m1 = 2 * L - m2,
                    a  = [
                        hue2rgb(m1, m2, H + 1 / 3) * 256,
                        hue2rgb(m1, m2, H) * 256,
                        hue2rgb(m1, m2, H - 1 / 3) * 256,
                        1
                    ];
                if(l === 4){
                    a[3] = c[3];
                }
                return Color.fromArray(a, obj);
            }
        },
        fromArray: function (/*Array*/ arr, /*Color?*/ obj) {
            var result = obj || new Color();
            result.set(Number(arr[0]), Number(arr[1]), Number(arr[2]), Number(arr[3]));
            if (isNaN(result.a)) {
                result.a = 1;
            }
            return result.sanitize();
        },
        fromString: function (/*String*/ str, /*Color?*/ obj) {
            var s = Color.hexByName[str];
            return s && Color.fromHex(s, obj) ||
                Color.fromRgb(str, obj) ||
                Color.fromHex(str, obj) ||
                Color.fromHsl(str, obj);
        }
    });


    function confine (c, low, high) {
        c = Number(c);
        return pastry.isFinite(c) ? (c < low ? low : c > high ? high : c) : high;
    }
    function hue2rgb (m1, m2, h) {
        if (h < 0) {
            ++h;
        }
        if (h > 1) {
            --h;
        }
        var h6 = 6 * h;
        if (h6 < 1) {
            return m1 + (m2 - m1) * h6;
        }
        if (2 * h < 1) {
            return m2;
        }
        if (3 * h < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        return m1;
    }
    function rgb2hsl (r, g, b, a) {
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h, s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2;               break;
                case b: h = (r - g) / d + 4;               break;
            }
            h /= 6;
        }
        return [h, s, l, a];
    }

    classMaker = pastry.extend(initProps, {
        constructor: Color,
        initialise: function (color) {
            var instance = this;
            if (pastry.isString(color)) {
                Color.fromString(color, this);
            } else if (pastry.isArray(color)) {
                Color.fromArray(color, this);
            } else {
                instance.set(color.r, color.g, color.b, color.a);
                if (!(color instanceof Color)) {
                    instance.sanitize();
                }
            }
            return instance;
        },
        set: function(r, g, b, a){
            var instance = this;
            instance.r = r;
            instance.g = g;
            instance.b = b;
            instance.a = a;
            return instance;
        },
        sanitize: function () {
            var instance = this;

            instance.r = round(confine(instance.r, 0, 255));
            instance.g = round(confine(instance.g, 0, 255));
            instance.b = round(confine(instance.b, 0, 255));
            instance.a = confine(instance.a, 0, 1);
            return instance;
        },
        toRgba: function () {
            var instance = this;
            return [instance.r, instance.g, instance.b, instance.a];
        },
        toHsla: function () {
            var instance = this;
            return rgb2hsl(instance.r, instance.g, instance.b, instance.a);
        },
        toHex: function () {
            var instance = this,
                arr = pastry.map(['r', 'g', 'b'], function (x) {
                    var str = instance[x].toString(16);
                    return str.length < 2 ? '0' + str : str;
                });
            return '#' + arr.join('');
        },
        toCss: function (/*Boolean?*/ includeAlpha) {
            var instance = this,
                rgb = instance.r + ', ' + instance.g + ', ' + instance.b;
            return (includeAlpha ? 'rgba(' + rgb + ',' + instance.a : 'rgb(' + rgb) + ')';
        },
        toString: function () {
            return this.toCss(true);
        },
        toGrey: function () {
            var instance = this,
                g = round((instance.r + instance.g + instance.b) / 3);
            return Color.makeGrey(g, instance.a);
        },
        destroy: function () {
            pastry.destroy(this);
        }
    });

    return pastry.Color = declare('pastry/color/Color', classMaker);
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/fmt/date', [
    'pastry/pastry'
], function (
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : fmt 模块 - date
     */

    function doubleDigit (n) {
        return n < 10 ? '0' + n : n;
    }
    function lms (ms) {
        var str = ms + '',
            len = str.length;
        return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
    }

    return pastry.fmtDate = function (date, pattern) {
        /*
         * @reference   : https://github.com/dojo/dojo/blob/master/json.js#L105
         * @description : return stringified date according to given pattern.
         * @parameter*  : {date  } date, input Date object
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @parameter   : {string} pattern, defines pattern for stringify.
         * @return      : {string} result string.
         * @syntax      : fmtDate(date, [pattern])
         * @example     :
         //    '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}.{Milliseconds}Z' => '2013-10-03T00:57::13.180Z'
         */
        if (pastry.isDate(date)) {
            pattern = pattern || '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}Z';

            return pattern.replace(/\{(\w+)\}/g, function (t, prop) {
                var fullProp = 'get' + ((prop === 'Year') ? prop : ('UTC' + prop)),
                    num = date[fullProp]() + ((prop === 'Month') ? 1 : 0);
                return prop === 'Milliseconds' ? lms(num) : doubleDigit(num);
            });
        } else {
            throw 'not a Date instance';
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/encoding/json', [
    'pastry/pastry',
    'pastry/fmt/date'
], function (
    pastry,
    fmtDate
) {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @date        : 2014-10-07
     * @description : shim 模块 - JSON
     * @reference   : https://github.com/dojo/dojo/blob/master/json.js
     */
    function exportJSON (obj) {
        /*
         * export JSON object
         */
        pastry.json = obj;
        pastry.setGLOBAL('JSON', obj);
        return obj;
    }

    // 注释掉这一段来测试shim代码 {
        if (
            typeof JSON !== 'undefined' && JSON &&
            !!JSON.parse && !!JSON.stringify
        ) {
            return exportJSON(JSON);
        }
    // }

    var D2JSON = Date.prototype.toJSON,
        // saving codes {
            isFunction = pastry.isFunction,
            isString   = pastry.isString,
            isNumber   = pastry.isNumber;
        // }

    // 补全基础数据类型的 toJSON 方法 {
        if (!isFunction(D2JSON)) {
            pastry.each([
                String.prototype,
                Number.prototype,
                Boolean.prototype
            ], function (p) {
                p.toJSON = function () {
                    return this.valueOf();
                };
            });
            D2JSON = function () {
                return isFinite(this.valueOf()) ? fmtDate(this) : null;
            };
        }
    // }

    var undef,
        escapeString = function (/*String*/str) {
            return ('"' + str.replace(/(["\\])/g, '\\$1') + '"')
                .replace(/[\f]/g, '\\f')
                .replace(/[\b]/g, '\\b')
                .replace(/[\n]/g, '\\n')
                .replace(/[\t]/g, '\\t')
                .replace(/[\r]/g, '\\r');
        },
        shim = {
            parse: function (str, strict) {
                /*
                 * @description: 从 JSON 字符串得到一个数据结构
                 */
                if (strict && !/^([\s\[\{]*(?:"(?:\\.|[^"])*"|-?\d[\d\.]*(?:[Ee][+-]?\d+)?|null|true|false|)[\s\]\}]*(?:,|:|$))+$/.test(str)) {
                    throw 'Invalid characters in JSON';
                }
                /* jshint -W061 */
                return eval('(' + str + ')');
            },
            stringify: function (value, replacer, spacer) {
                /*
                 * @description: 把内置数据类型转为 JSON 字符串
                 */
                if (isString(replacer)) {
                    spacer = replacer;
                    replacer = null;
                }
                function stringify (it, indent, key) {
                    if (replacer) {
                        it = replacer(key, it);
                    }
                    var val;
                    if (isNumber(it)) {
                        return isFinite(it) ? it + '' : 'null';
                    }
                    if (pastry.isBoolean(it)) {
                        return it + '';
                    }
                    if (it === null) {
                        return 'null';
                    }
                    if (isString(it)) {
                        return escapeString(it);
                    }
                    if (isFunction(it) || !it) {
                        return undef;
                    }
                    if (isFunction(it.toJSON)) {
                        return stringify(it.toJSON(key), indent, key);
                    }
                    if (pastry.isDate(it)) {
                        return fmtDate(it);
                    }
                    if (it.valueOf() !== it) {
                        return stringify(it.valueOf(), indent, key);
                    }
                    var nextIndent= spacer ? (indent + spacer) : '',
                        sep = spacer ? ' ' : '',
                        newLine = spacer ? '\n' : '';

                    if (pastry.isArray(it)) {
                        var itl = it.length,
                            res = [];
                        for (key = 0; key < itl; key++) {
                            var obj = it[key];
                            val = stringify(obj, nextIndent, key);
                            if (!isString(val)) {
                                val = 'null';
                            }
                            res.push(newLine + nextIndent + val);
                        }
                        return '[' + res.join(',') + newLine + indent + ']';
                    }
                    var output = [];
                    for (key in it) {
                        var keyStr;
                        if (it.hasOwnProperty(key)) {
                            if (isNumber(key)) {
                                keyStr = '"' + key + '"';
                            } else if (isString(key)) {
                                keyStr = escapeString(key);
                            } else {
                                continue;
                            }
                            val = stringify(it[key], nextIndent, key);
                            if (!isString(val)) {
                                continue;
                            }
                            output.push(newLine + nextIndent + keyStr + ':' + sep + val);
                        }
                    }
                    return '{' + output.join(',') + newLine + indent + '}';
                }
                return stringify(value, '', '');
            }
        };

    return exportJSON(shim);
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/encoding/cron', [
    'pastry/pastry',
    'pastry/fmt/sprintf',
    'pastry/fmt/vsprintf'
], function(
    pastry,
    sprintf,
    vsprintf
) {
    'use strict';
    /*
     * @author: 绝云（wensen.lws）
     * @description: cron expression parser/stringifier
     * @note: accepted format
     *   (*) * * * * *
     *    |  | | | | |
     *    |  | | | | --- day of week       (1 - 7 )
     *    |  | | | ----- month             (1 - 12)
     *    |  | | ------- day of month      (1 - 31)
     *    |  | --------- hour              (0 - 23)
     *    |  ----------- minute            (0 - 59)
     *    -------------- (optional) second (0 - 59)
     * @syntax:
     *   cron.parse('1 * /5 1,2,3 3 2'); => {
     *       second     : [1],
     *       minute     : [*],
     *       hour       : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
     *       dayOfMonth : [1, 2, 3],
     *       month      : [3],
     *       month      : [2],
     *   }
     *   cron.stringify({
     *       second     : [1],
     *       minute     : [*],
     *       hour       : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
     *       dayOfMonth : [1, 2, 3],
     *       month      : [3],
     *       month      : [2],
     *   }); => '1 * 0,5,10,15,20,25,30,35,40,45,50,55 1,2,3 3 2'
     */

    var
        clone = pastry.clone,
        each = pastry.each,
        indexOf = pastry.indexOf,
        isArray = pastry.isArray,
        toInt = pastry.toInt,
        uc = pastry.uc,
        RANGE = {
            second     : [0, 59],
            minute     : [0, 59],
            hour       : [0, 23],
            dayOfMonth : [1, 31],
            month      : [1, 12],
            dayOfWeek  : [1, 7 ],
        },
        NAMES = [
            'second',
            'minute',
            'hour',
            'dayOfMonth',
            'month',
            'dayOfWeek'
        ],
        ALIAS = {
            dayOfWeek: [
                'MON',
                'TUE',
                'WED',
                'THU',
                'FRI',
                'SAT',
                'SUN'
            ],
            month: [
                'JAN',
                'FEB',
                'MAR',
                'APR',
                'MAY',
                'JUN',
                'JUL',
                'AUG',
                'SEP',
                'OCT',
                'NOV',
                'DEC'
            ],
        };

    function alias2number(alias, name) {
        var errorStr = sprintf('Invalid str: %s', alias);
        alias = uc(alias);
        if (isNaN(alias) && name !== 'month' && name !== 'dayOfWeek') {
            throw errorStr;
        }
        if (isNaN(alias) && indexOf(ALIAS[name], alias) < 0) {
            throw errorStr;
        }
        return isNaN(alias) ? indexOf(ALIAS[name], alias) + 1 : toInt(alias);
    }
    function isInRange(min, max, check) {
        return min <= check && check <= max;
    }

    return pastry.cron = {
        alias: ALIAS,
        parse: function(expression) {
            var parts = expression.split(' '),
                length = parts.length,
                partNames = clone(NAMES),
                cronObj = {};

            // check and pre-process
            switch (length) {
                case 5:
                    pastry.remove(partNames, 0);
                    break;
                case 6:
                    break;
                default:
                    throw sprintf('Invalid cron expression: %s', expression);
            }

            // parse
            function parseRange(atom, name) {
                var fromTo = atom.split('-'),
                    from = alias2number(fromTo[0], name),
                    to = alias2number(fromTo[1], name),
                    minMax = RANGE[name],
                    min = minMax[0],
                    max = minMax[1];

                if (!isInRange(min, max, from) || !isInRange(from, max, to)) {
                    throw sprintf('%s: %s should be in range %s-%s', name, atom, min, max);
                }

                for (var i = from; i <= to; i++) {
                    cronObj[name].push(i);
                }

            }
            function parseStep(atom, name) {
                var step = toInt(atom.split('/')[1]);
                for (var i = 0; i < RANGE[name][1]; i++) {
                    if (i % step === 0) {
                        cronObj[name].push(i);
                    }
                }
            }
            function parseSingle(atom, name) {
                atom = alias2number(atom, name);
                var minMax = RANGE[name],
                    min = minMax[0],
                    max = minMax[1];
                if (!isInRange(min, max, atom)) {
                    throw sprintf('%s: %s should be in range %s-%s', name, atom, min, max);
                }
                cronObj[name].push(atom);
            }
            function parse(part, name) {
                if (part === '*') {
                    return cronObj[name].push(parts);
                }
                each(part.split(','), function(atom) {
                    if (atom.indexOf('-') >= 0) {
                        parseRange(atom, name);
                    } else if (atom.indexOf('/') >= 0) {
                        parseStep(atom, name);
                    } else {
                        parseSingle(atom, name);
                    }
                });
            }

            // process
            each(partNames, function(name, index) {
                cronObj[name] = [];
                parse(parts[index], name);
            });
            return cronObj;
        },
        stringify: function(cronObj) {
            var patterns = [],
                args = [];
            each(NAMES, function(name) {
                var attrs = cronObj[name];
                if (isArray(attrs)) {
                    patterns.push('%s');
                    args.push(attrs.join(','));
                }
            });
            if (args.length !== 5 && args.length !== 6) {
                throw 'Invalid cront object!';
            }
            return vsprintf(patterns.join(' '), args);
        }
    };
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('pastry/html/escape', [
    'pastry/pastry'
], function(
    pastry
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : utils for html
     */
    var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        },
        unescapeMap = pastry.invert(escapeMap);

    function createEscaper (map) {
        // Regexes for identifying a key that needs to be escaped
        var source        = '(?:' + pastry.keys(map).join('|') + ')',
            testRegexp    = new RegExp(source),
            replaceRegexp = new RegExp(source, 'g');

        function escaper (match) {
            return map[match];
        }

        return function (string) {
            string = string === null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    }

    return {
        escape   : pastry.escape   = createEscaper(escapeMap),
        unescape : pastry.unescape = createEscaper(unescapeMap)
    };
});


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


/* jshint strict: true, undef: true, unused: true */
/* global define, Promise */

define('pastry/promise/Promise', [
    'pastry/pastry',
    'pastry/oop/declare'
], function(
    pastry,
    declare
) {
    'use strict';
    /*
     * @author      : 绝云（wensen.lws）
     * @description : promise shim
     */
    function exportPromise (constructor) {
        pastry.Promise = constructor;
        pastry.setGLOBAL('Promise', constructor);
        return constructor;
    }

    // 注释掉这一段来测试shim代码 {
        if (
            typeof Promise !== 'undefined' && Promise &&
            !!Promise.resolve
        ) {
            return exportPromise(Promise);
        }
    // }

    var extend = pastry.extend,
        each = pastry.each,
        isArray = pastry.isArray,
        isFunction = pastry.isFunction,
        isObject = pastry.isObject,
        Resolver = declare('pastry/promise/Resolver', [], {
            constructor: function() {
                extend(this, {
                    _callbacks: [],
                    _errbacks: [],
                    _status: 'pending',
                    _result: null
                });
            },
            fulfill: function (value) {
                var me = this,
                    status = me._status;

                if (status === 'pending' || status === 'accepted') {
                    me._result = value;
                    me._status = 'fulfilled';
                }

                if (me._status === 'fulfilled') {
                    me._notify(me._callbacks, me._result);
                    me._callbacks = [];
                    me._errbacks = null;
                }
            },
            reject: function (reason) {
                var me = this,
                    status = me._status;

                if (status === 'pending' || status === 'accepted') {
                    me._result = reason;
                    me._status = 'rejected';
                }

                if (me._status === 'rejected') {
                    me._notify(me._errbacks, me._result);
                    me._callbacks = null;
                    me._errbacks = [];
                }
            },
            resolve: function (value) {
                var me = this;
                if (me._status === 'pending') {
                    me._status = 'accepted';
                    me._value = value;

                    if ((me._callbacks && me._callbacks.length) ||
                        (me._errbacks && me._errbacks.length)) {
                        me._unwrap(me._value);
                    }
                }
            },
            _unwrap: function (value) {
                var me = this, unwrapped = false, then;

                if (!value || (!isObject(value) && !isFunction(value))) {
                    me.fulfill(value);
                    return;
                }

                try {
                    then = value.then;
                    if (isFunction(then)) {
                        then.call(value, function (value) {
                            if (!unwrapped) {
                                unwrapped = true;
                                me._unwrap(value);
                            }
                        }, function (reason) {
                            if (!unwrapped) {
                                unwrapped = true;
                                me.reject(reason);
                            }
                        });
                    } else {
                        me.fulfill(value);
                    }
                } catch (e) {
                    if (!unwrapped) {
                        me.reject(e);
                    }
                }
            },
            _addCallbacks: function (callback, errback) {
                var me = this,
                    callbackList = me._callbacks,
                    errbackList = me._errbacks;

                if (callbackList) {
                    callbackList.push(callback);
                }
                if (errbackList) {
                    errbackList.push(errback);
                }
                switch (me._status) {
                    case 'accepted':
                        me._unwrap(me._value);
                        break;
                    case 'fulfilled':
                        me.fulfill(me._result);
                        break;
                    case 'rejected':
                        me.reject(me._result);
                        break;
                }
            },
            _notify: function (subs, result) {
                if (subs.length) {
                    Constructor.async(function () {
                        each(subs, function(sub) {
                            sub(result);
                        });
                    });
                }
            }
        });

    function Constructor(fn) {
        var me = this;
        if (!isFunction(fn)) {
            throw 'Promise resolver ' + fn + ' is not a function';
        }

        var resolver = me._resolver = new Resolver();

        try {
            fn(function (value) {
                resolver.resolve(value);
            }, function (reason) {
                resolver.reject(reason);
            });
        } catch (e) {
            resolver.reject(e);
        }
    }

    pastry.extend(Constructor, {
        Resolver: Resolver,
        resolve: function(value) {
            if (value && value.constructor === this) {
                return value;
            }
            return new this(function (resolve) {
                resolve(value);
            });
        },
        reject: function(reason) {
            var promise = new this(function () {});

            promise._resolver._result = reason;
            promise._resolver._status = 'rejected';
            return promise;
        },
        all: function(values) {
            return new Constructor(function (resolve, reject) {
                if (!isArray(values)) {
                    reject(new Error('Promise.all expects an array of values or promises'));
                    return;
                }

                var remaining = values.length,
                    i = 0,
                    length = values.length,
                    results = [];

                function oneDone(index) {
                    return function (value) {
                        results[index] = value;

                        remaining--;

                        if (!remaining) {
                            resolve(results);
                        }
                    };
                }
                if (length < 1) {
                    return resolve(results);
                }
                for (; i < length; i++) {
                    Constructor.resolve(values[i]).then(oneDone(i), reject);
                }
            });
        },
        race: function(values) {
            return new Constructor(function (resolve, reject) {
                if (!isArray(values)) {
                    reject(new Error('Promise.race expects an array of values or promises'));
                    return;
                }
                each(values, function(value) {
                    Constructor.resolve(value).then(resolve, reject);
                });
            });
        },
        async: pastry.getAny(
            function() { if (setImmediate) { return function (fn) {setImmediate(fn);}; } },
            function() { return process.nextTick; },
            function() { return function (fn) {setTimeout(fn, 0);}; }
        ),
        _makeCallback: function(promise, resolve, reject, fn) {
            return function (valueOrReason) {
                var result;

                try {
                    result = fn(valueOrReason);
                } catch (e) {
                    reject(e);
                    return;
                }
                if (result === promise) {
                    reject(new Error('Cannot resolve a promise with itself'));
                    return;
                }
                resolve(result);
            };
        }
    });

    return exportPromise(declare('pastry/promise/Promise', [], {
        constructor: Constructor,
        then: function(callback, errback) {
            var resolve, reject,
                promise = new Constructor(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });

            this._resolver._addCallbacks(
                isFunction(callback) ?
                    Constructor._makeCallback(promise, resolve, reject, callback) :
                    resolve,
                isFunction(errback) ?
                    Constructor._makeCallback(promise, resolve, reject, errback) :
                    reject
            );
            return promise;
        },
        'catch': function(errback) {
            return this.then(undefined, errback);
        }
    }));
});


/* jshint strict: true, undef: true, unused: true */
/* global define */

define('all-nodejs-modules',[
    // formatting {
        'pastry/fmt/vsprintf',
        'pastry/fmt/camelCase',
    // }
    // Color {
        'pastry/color/Color',
    // }
    // encoding {
        'pastry/encoding/json',
        'pastry/encoding/cron',
    // }
    // text {
        // i18n TODO {
            //'pastry/locale/en_us',
            //'pastry/text/i18n',
        // }
        'pastry/text/template',
    // }
    // declare {
        'pastry/oop/declare',
    // }
    // html {
        'pastry/html/escape',
    // }
    // promise {
        'pastry/promise/Promise',
    // }
], function() {
    /*
     * @author      : 绝云（wensen.lws）
     * @description : for building an amd-debug version of pastry
     */
});


