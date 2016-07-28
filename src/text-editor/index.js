'use strict';
/**
 * index.js module
 * @module index.js
 * @see module:index
 */
require('./index.less');
import $ from 'jquery';
import lang from 'zero-lang';
import CodeMirror from 'codemirror';
import globalVars from '../common/global-variables';
const rc = globalVars.rc;
const fileInfo = globalVars.fileInfo;

const $loading = $('#loading');
const $code = $('#code');

CodeMirror.modeURL = `${rc.assetsServer}/dist/lib/codemirror/mode/%N/%N.js`;

const editor = CodeMirror.fromTextArea($code[0], {
  lineNumbers: true
});

const info = CodeMirror.findModeByExtension(fileInfo.extname);
if (info && info.mode) {
  editor.setOption('mode', info.spec);
  CodeMirror.autoLoadMode(editor, info.mode);
}

$loading.hide();
