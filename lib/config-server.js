/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var path = require('path');
var fsExtraPromise = require('fs-extra-promise');
var arrayUtils = require('zero-lang-array');
var objectUtils = require('zero-lang-object');
var yaml = require('js-yaml');

function readYamlFile(file) {
    try {
        var result = yaml.safeLoad(fsExtraPromise.readFileSync(file, 'utf8'));
        return result;
    } catch(e) {
        return {};
    }
}

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
    root = root || process.pwd();
    var result = {
        root: root,
    };

    objectUtils.extend(
        result,
        readYamlFile(path.resolve(__dirname, '../config/server.yaml')),
        readYamlFile(path.resolve('~/.zfinder-server-config.yaml')),
        readYamlFile(path.resolve(root, './.zfinder-server-config.yaml'))
    );

    if (options.config) {
        objectUtils.extend(
            result,
            readYamlFile(path.resolve(options.config))
        );
    }

    arrayUtils.each([
        'force',
        'port'
    ], function(prop) {
        if (objectUtils.hasKey(options, prop)) {
            result[prop] = options[prop];
        }
    });

    return result;
};

