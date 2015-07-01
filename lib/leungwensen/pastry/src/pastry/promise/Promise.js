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

