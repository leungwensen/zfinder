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

