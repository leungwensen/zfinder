'use strict';
/**
 * loading module
 * @module loading
 * @see module:index
 */
import './index.less';
import $ from 'jquery';

const $loading = $('#loading');

export default {
  show() {
    $loading.show();
  },

  hide() {
    $loading.hide();
  }
};
