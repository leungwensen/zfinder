'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import './index.less';
import $ from 'jquery';

const searchBar = Object.create(HTMLElement.prototype);

function generateSearchBar() {
  return `<input type="text" required/>
<span class="placeholder">
  <svg-icon type="search"></svg-icon>
  <span class="placeholder-text">Search</span>
  <span class="btn-clear"><svg-icon type="backspace"></svg-icon></span>
</span>`;
}

searchBar._setContent = function () {
  this.innerHTML = generateSearchBar();
};

searchBar.createdCallback = function () {
  const me = this;
  me._setContent();
  $(me).on('click', '.btn-clear', () => {
    $(me).find('input').val('');
  });
};

searchBar.attributeChangedCallback = function () {
  this._setContent();
};

export default document.registerElement('search-bar', {
  prototype: searchBar
});
