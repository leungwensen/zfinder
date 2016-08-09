'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import './index.less';
import '../common/time-elements/index';
import '../common/svg-icon-element/index';
import '../common/search-bar-element/index';
import '../common/bread-crumbs-element/index';
import globalVars from '../common/global-variables';
import loading from '../common/loading/index';
import router from './router';
import store from './store';

console.log(globalVars);

loading.hide();
