import $ from 'jquery';

const dialog = Object.create(HTMLElement.prototype);

function generateDialog(msg) {
  return `<div class="overlay"></div>
<div class="content">
  <div class="message">${msg}</div>
  <div class="buttons"><a class="btn block">OK</a></div>
</div>`;
}

dialog._setContent = function () {
  const me = this;
  const msg = me.getAttribute('message') || '';
  me.innerHTML = generateDialog(msg);
};

dialog.createdCallback = function () {
  const me = this;
  me._setContent();
  $(me).on('click', '.btn-clear', () => {
    $(me).find('input').val('');
  });
};

dialog.attributeChangedCallback = function () {
  const me = this;
  $(me).find('.message').html(me.getAttribute('message'));
};

dialog.show = function () {
  $(this).show();
};
dialog.hide = function () {
  $(this).hide();
};

export default document.registerElement('dialog-alert', {
  prototype: dialog
});
