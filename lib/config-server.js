/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var lang = require('zero-lang');
var path = require('path');
var zfinderUtils = require('zfinder-utils'),
    loadYamlConfig = zfinderUtils.loadYamlConfig;

module.exports = function (root, options) {
    /*
     * root: root path to run server on
     *
     * options:
     *     - force [true|false]
     *     - port (port server will run on)
     *     - config (specify path to a configuration file)
     *
     * we have these places to get configurations:
     *     - options(runtime-config)
     *     - config file in root($root/.zfinder-server-config.yaml)
     *     - user config file($HOME/.zfinder-server-config.yaml)
     *     - default config file($zfinder-cli/config/server.yaml)
     * and the former one has a higher priority
     */
    root = root || process.cwd();
    var result = {
        root: root,
        // for testing local middlewares
        localmiddleware: {}
    };
    if (options.localmiddleware) {
        options.localmiddleware = lang.isArray(options.localmiddleware) ?
            options.localmiddleware : [options.localmiddleware];
        lang.each(options.localmiddleware || [], function(mw) {
            result.localmiddleware[path.resolve(process.cwd(), mw)] = {
                local: true
            };
        });
    }

    lang.extend(
        result,
        loadYamlConfig(path.resolve(__dirname, '../config/server.yaml')),
        loadYamlConfig(path.resolve('~/.zfinder-server-config.yaml')),
        loadYamlConfig(path.resolve(root, './.zfinder-server-config.yaml'))
    );

    if (options.config) {
        lang.extend(
            result,
            loadYamlConfig(path.resolve(options.config))
        );
    }

    lang.each([
        'open',
        'port'
    ], function(prop) {
        if (lang.hasKey(options, prop)) {
            result[prop] = options[prop];
        }
    });

    //console.log(result);

    return result;
};

