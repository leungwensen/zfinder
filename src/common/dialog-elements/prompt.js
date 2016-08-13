import $ from 'jquery';

const dialog = Object.create(HTMLElement.prototype);

function generateDialog() {
  return `<div class="overlay"></div>
<div class="content">
</div>`;
}

dialog._setContent = function () {
  const me = this;
  const msg = me.getAttribute('message') || '';
  this.innerHTML = generateDialog(msg);
};

dialog.createdCallback = function () {
  const me = this;
  me._setContent();
  $(me).on('click', '.btn-clear', () => {
    $(me).find('input').val('');
  });
};

dialog.attributeChangedCallback = function () {
  this._setContent();
};

export default document.registerElement('dialog-prompt', {
  prototype: dialog
});
