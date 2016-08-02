'use strict';
/**
 * index.js module
 * @module index.js
 * @see module:index
 */
require('./index.less');
import $ from 'jquery';
import CodeMirror from 'codemirror';
import globalVars from '../common/global-variables';
import loading from '../common/loading/index';

const $code = $('#code');
const fileInfo = globalVars.fileInfo;
const rc = globalVars.rc;

CodeMirror.modeURL = `${rc.assetsServer}/dist/lib/codemirror/mode/%N/%N.js`;

const editor = CodeMirror.fromTextArea($code[0], {
  lineNumbers: true
});

const info = CodeMirror.findModeByExtension(fileInfo.extname);
if (info && info.mode) {
  editor.setOption('mode', info.mime);
  CodeMirror.autoLoadMode(editor, info.mode);
}

loading.hide();
