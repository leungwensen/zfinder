'use strict';
/**
 * dialog module
 * @module dialog
 * @see module:index
 */
import $ from 'jquery';

class Dialog extends HTMLElement {
  _setContent() {
    this.innerHTML = '';
  }

  createdCallback() {
    const me = this;
    me._setContent();
    $(me).on('click', '.btn-confirm', () => {
    });
    $(me).on('click', '.btn-cancel', () => {
    });
    $(me).on('keyup', '.input', () => {
    });
    $(me).hide();
  }

  show() {
    // add class to body
    $(this).show();
  }

  hide() {
    // remove class from body
    $(this).hide();
  }

  callback() {
  }

  validate() {
    return true;
  }
}

export default Dialog;
