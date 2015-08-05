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
                    applyNativeFunction(AP.forEach, toArray(obj), arguments);
                } else if (isPlainObject(obj)) {
                    objForEach(obj, callback, thisObj);
                }
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
                    resultArr = resultArr.concat(arr);
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

