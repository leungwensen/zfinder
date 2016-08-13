import $ from 'jquery';

const dialog = Object.create(HTMLElement.prototype);

function generateDialog() {
  return `<div class="overlay"></div>
<div class="content">
</div>`;
}

dialog._setContent = function () {
  this.innerHTML = generateDialog();
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

export default document.registerElement('dialog-confirm', {
  prototype: dialog
});
