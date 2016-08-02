'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
const svgIcon = Object.create(HTMLElement.prototype);

function generateSvgIcon(url, type) {
  const id = `si-zfinder-${type}`;
  return `<div class="si-wrapper ${type}">
  <svg class="si"><use xlink:href="${url}#${id}"></use></svg>
</div>`;
}

svgIcon._setContent = function () {
  const url = this.getAttribute('url') || '';
  const type = this.getAttribute('type');
  this.innerHTML = generateSvgIcon(url, type);
};

svgIcon.createdCallback = function () {
  this._setContent();
};

svgIcon.attributeChangedCallback = function () {
  this._setContent();
};

export default document.registerElement('svg-icon', {
  prototype: svgIcon
});
