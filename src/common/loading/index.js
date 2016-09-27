'use strict';
/**
 * loading module
 * @module loading
 * @see module:index
 */
import $ from 'jquery';
import './index.less';

const $loading = $('#loading');

export default {
  show() {
    $loading.show();
  },

  hide() {
    $loading.hide();
  }
};
