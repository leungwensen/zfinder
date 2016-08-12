'use strict';
/**
 * plantuml2svg module
 * @module plantuml2svg
 * @see module:index
 */
const path = require('path');
const shelljs = require('shelljs');
shelljs.config.silent = true;

const plantumlJAR = path.resolve(__dirname, '../../bin/plantuml.jar');
const plantumlCMD = `java -jar ${plantumlJAR} -charset "utf8" -nbthread auto -quiet -failfast2 -tsvg -pipe`;

module.exports = (str) => shelljs.ShellString(str).exec(plantumlCMD).stdout;
