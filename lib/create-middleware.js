/* jshint esnext: true, node: true, loopfunc: true, undef: true, unused: true */

var fsExtraPromise = require('fs-extra-promise');
var path = require('path');
var shelljs = require('shelljs');
var lang = require('zero-lang');
var camelcase = require('zero-fmt/camelcase');
var fmtDate = require('zero-fmt/date');
var sprintf = require('zero-fmt/sprintf');
var template = require('zero-text/template');

// add helper functions to template engine
lang.extend(template.helper, lang, camelcase);

module.exports = function(options) {
    options.date = fmtDate(new Date(), '{FullYear}{Month}{Date}');
    options.timestamp = Date.now();
    var targetRoot = path.resolve(options.root, options.name);
    var templatesRoot = path.resolve(__dirname, '../templates');

    lang.each([
        'lib',
        'spec',
    ], function(dirname) {
        shelljs.mkdir('-p', sprintf('%s/%s', targetRoot, dirname));
    });

    lang.each([
        '.gitignore',
        'LICENSE'
    ], function(filename) {
        shelljs.cp('-f', sprintf('%s/%s', templatesRoot, filename), targetRoot);
    });

    lang.each([
        'config.yaml',
        'package.json',
        'Makefile',
        'README.md',
        'lib/index.js',
        'spec/index.spec.js',
        'spec/index.html'
    ], function(filename) {
        fsExtraPromise.readFileAsync(sprintf('%s/%s', templatesRoot, filename), {
            encoding: 'utf8'
        }).then(function(data) {
            var targetFilename = sprintf('%s/%s', targetRoot, filename);
            fsExtraPromise.writeFileAsync(targetFilename, template.render(data, options, {
                newline: true,
                ne: true
            })).then(function() {
                console.log(sprintf('%s created!', targetFilename));
            });
        });
    });
};

