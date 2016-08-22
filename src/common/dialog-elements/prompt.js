'use strict';
/**
 * dialog module
 * @module dialog
 * @see module:index
 */
import $ from 'jquery';
import Dialog from './dialog';

function generateDialog(msg, inputs) {
  return `<div class="overlay"></div>
<div class="content">
  <div class="message">${msg}</div>
  <div class="inputs">${inputs}</div>
  <div class="buttons">
    <a class="btn btn-block btn-cancel">Cancel</a>
    <a class="btn btn-block btn-confirm">OK</a>
  </div>
</div>`;
}

class PromptDialog extends Dialog {
  _setContent() {
    const me = this;
    const msg = me.getAttribute('message') || '';
    const inputs = me.getAttribute('inputs') || '';
    me.innerHTML = generateDialog(msg, inputs);
  }

  attributeChangedCallback() {
    const me = this;
    $(me).find('.message').html(me.getAttribute('message'));
    $(me).find('.inputs').html(me.getAttribute('inputs'));
  }
}

export default document.registerElement('dialog-prompt', PromptDialog);
