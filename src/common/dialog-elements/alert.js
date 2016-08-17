'use strict';
/**
 * dialog module
 * @module dialog
 * @see module:index
 */
import $ from 'jquery';
import Dialog from './dialog';

function generateDialog(msg) {
  return `<div class="overlay"></div>
<div class="content">
  <div class="message">${msg}</div>
  <div class="buttons"><a class="btn btn-block btn-confirm">OK</a></div>
</div>`;
}

class AlertDialog extends Dialog {
  _setContent() {
    const me = this;
    const msg = me.getAttribute('message') || '';
    me.innerHTML = generateDialog(msg);
  }

  attributeChangedCallback() {
    const me = this;
    $(me).find('.message').html(me.getAttribute('message'));
  }
}

export default document.registerElement('dialog-alert', AlertDialog);
