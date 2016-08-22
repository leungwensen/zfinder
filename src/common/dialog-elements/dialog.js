'use strict';
/**
 * dialog module
 * @module dialog
 * @see module:index
 */
import $ from 'jquery';
import '../jquery-serialize-object';

class Dialog extends HTMLElement {
  _setContent() {
    this.innerHTML = '';
  }

  _getData() {
    return $(this).serializeObject();
  }

  createdCallback() {
    const me = this;
    me._setContent();
    $(me).on('click', '.btn-confirm', () => {
      if (me.validate()) {
        me.callback(me._getData());
        me.hide();
      }
    });
    $(me).on('click', '.btn-cancel', () => {
      me.callback(null);
      me.hide();
    });
    $(me).on('click', '.btn-close', () => {
      me.hide();
    });
    $(me).on('click', '.overlay', () => {
      me.hide();
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
