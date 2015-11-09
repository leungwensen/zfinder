/* jshint node: true, loopfunc: true, undef: true, unused: true */
///* global */

var Middleware = require('zfinder-middleware');
var Route = require('zfinder-route');
var lang = require('zero-lang');
var path = require('path');
var sprintf = require('zero-fmt/sprintf');
var zfinderUtils = require('zfinder-utils');

var defaultConfig = zfinderUtils.loadYamlConfig(path.resolve(__dirname, '../config.yaml'));

var mw = new Middleware()
    .addRoute(new Route({
        // properties
        name: '',
        method: 'get', // all|get|post|put|delete|options
        url: '*',
        priority: 1,

        // methods
        serve: function(options) {
            options = lang.extend({}, defaultConfig, options);

            // fill properties {
                var me = this;
                me.priority = options.priority;
                me.name = sprintf('%s:%s', options.name, me.method);
            // }

            // your code goes here
            return function(req, res, next) {
                next();
            };
        },
    }));

module.exports = mw;

