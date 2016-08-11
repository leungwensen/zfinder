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
import './router';
import globalVars from '../common/global-variables';
import loading from '../common/loading/index';

console.log(globalVars);

loading.hide();
