#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    //path = require('path'),
    pastry = require('../lib/leungwensen/pastry/build/nodejs.js'),
    utils = require('./utils.js'),
    prefix = 'client/template/',
    RE_acceptSuffix = /\.(html|htm|ptmpl)$/;

//function getFilename (path) {
    //var result = path.replace(RE_acceptSuffix, '');
    //return result.match(/(\w*)$/)[0];
//}

try {
    utils.walkFiles(prefix, function (file) {
        if (!RE_acceptSuffix.test(file)) { // 只接受 template 文件
            return;
        }
        var content = fs.readFileSync(file).toString(),
            outputFilename = file
                .replace(RE_acceptSuffix, function (/* suffix */) {
                    return '.js';
                }),
            //outputFileId = prefix.replace('src/', '') + getFilename(file),
            moduleStr = '/* jshint ignore:start */\n' +
                'define([' +
                    '"pastry/pastry",' +
                    '"pastry/html/escape"' +
                '], function (' +
                    'helper' +
                ') {' +
                    'return %s' +
                '});' +
                '\n/* jshint ignore:end */',
            // bugfix for node.js version 0.12.0 {
            //     * new Function(){} => toString() :
            //         * additional line break;
            //         * additional `/**/`;
            // }
            resultStr = pastry.template.compile(content).toString()
                .replace(/function\s+anonymous\s*\([^){]*\)\s*\{/, 'function(obj, ne){')
                .replace(/\\n\s+/g, '')
                .replace(/\/\*\*\//g, '');

        console.log(
            file,
            outputFilename// ,
            // outputFileId,
            // content,
            // pastry.template.compile(content),
            // resultStr
        );
        fs.writeFileSync(
            outputFilename,
            pastry.sprintf(
                moduleStr,
                //outputFileId,
                resultStr
            )
        );
    });
} catch(e) {
    console.log(e);
}
