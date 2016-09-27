'use strict';
/**
 * index.js module
 * @module index.js
 * @see module:index
 */
import $ from 'jquery';
import CodeMirror from 'codemirror';
import './index.less';
import globalVars from '../common/global-variables';
import loading from '../common/loading/index';

const $code = $('#code');
const pathInfo = globalVars.pathInfo;
const rc = globalVars.rc;

// FIXME mode url for CodeMirror
CodeMirror.modeURL = `${rc.assetsServer}/dist/lib/codemirror-5.18.2/mode/%N/%N.js`;

const editor = CodeMirror.fromTextArea($code[0], {
  foldGutter: true,
  lineNumbers: true,
  lineWrapping: true,
  gutters: [
    'CodeMirror-linenumbers',
    'CodeMirror-foldgutter'
  ],
});

const info = CodeMirror.findModeByExtension(pathInfo.extname);
if (info && info.mode) {
  editor.setOption('mode', info.mime);
  CodeMirror.autoLoadMode(editor, info.mode);
}

loading.hide();
