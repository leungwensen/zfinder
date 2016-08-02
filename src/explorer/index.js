'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
require('./index.less');
require('../common/time-elements/index');
require('../common/svg-icon-element/index');
import globalVars from '../common/global-variables';
import loading from '../common/loading/index';
// import $ from 'jquery';
// import lang from 'zero-lang';
// import routie from '../common/routie';

console.log(globalVars);

loading.hide();
