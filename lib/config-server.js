/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var arrayUtils = require('zero-lang-array');
var fsExtraPromise = require('fs-extra-promise');
var objectUtils = require('zero-lang-object');
var path = require('path');
var zfinderUtils = require('zfinder-utils');

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
        options.localmiddleware = arrayUtils.isArray(options.localmiddleware) ?
            options.localmiddleware : [options.localmiddleware];
        arrayUtils.each(options.localmiddleware || [], function(mw) {
            result.localmiddleware[path.resolve(process.cwd(), mw)] = {
                local: true
            };
        });
    }

    objectUtils.extend(
        result,
        zfinderUtils.loadYamlConfig(path.resolve(__dirname, '../config/server.yaml')),
        zfinderUtils.loadYamlConfig(path.resolve('~/.zfinder-server-config.yaml')),
        zfinderUtils.loadYamlConfig(path.resolve(root, './.zfinder-server-config.yaml'))
    );

    if (options.config) {
        objectUtils.extend(
            result,
            zfinderUtils.loadYamlConfig(path.resolve(options.config))
        );
    }

    arrayUtils.each([
        'open',
        'port'
    ], function(prop) {
        if (objectUtils.hasKey(options, prop)) {
            result[prop] = options[prop];
        }
    });

    var defaultFavicon = path.resolve(__dirname, '../favicon.ico');
    if (result.favicon) {
        try {
            if (!fsExtraPromise.statSync(path.resolve(result.favicon))) {
                result.favicon = defaultFavicon;
            }
        } catch(e) {
            result.favicon = defaultFavicon;
        }
    } else {
        result.favicon = defaultFavicon;
    }

    //console.log(result);

    return result;
};

