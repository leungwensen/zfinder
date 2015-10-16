/* jshint node: true, loopfunc: true, undef: true, unused: true */
///* global */

var path = require('path');
var Middleware = require('zfinder-middleware');
var Route = require('zfinder-route');
var objectUtils = require('zero-lang-object');
var zfinderUtils = require('zfinder-utils');

var defaultConfig = zfinderUtils.loadYamlConfig(path.resolve(__dirname, '../config.yaml'));

var mw = new Middleware()
    .addRoute(new Route({
        // properties
        name: '',
        method: 'get',
        url: '*',
        priority: 1,

        // methods
        serve: function(options) {
            options = objectUtils.extend({}, defaultConfig, options);
            // your code goes here
            return function(req, res, next) {
                next();
            };
        },
    }));

module.exports = mw;

