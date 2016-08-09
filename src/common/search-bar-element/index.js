'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import './index.less';
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
  this._setContent();
};

searchBar.attributeChangedCallback = function () {
  this._setContent();
};

export default document.registerElement('search-bar', {
  prototype: searchBar
});
