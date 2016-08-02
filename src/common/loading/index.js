'use strict';
/**
 * loading module
 * @module loading
 * @see module:index
 */
require('./index.less');
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
