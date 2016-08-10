'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import "./index.less";
import '../../common/time-elements/index';
import '../../common/file-size/index';
import '../../common/svg-icon-element/index';
import store from '../store';

const pathItem = Object.create(HTMLElement.prototype);

function generatePathItem(pathInfo) {
  return `<div class="image"><svg-icon type="${pathInfo.icon}"></svg-icon></div>
<div class="content">
  <p class="name">${pathInfo.basename}</p>
  <relative-time datetime="${pathInfo.mtime}"></relative-time>
</div>
<div class="more">
  ${pathInfo.isDirectory ? '' : `<file-size size="${pathInfo.size}"></file-size>`}
  <svg-icon type="more-horizontal" data-pathname="${pathInfo.relativePath}"></svg-icon>
</div>`;
}

pathItem._setContent = function () {
  const me = this;
  const pathname = me.getAttribute('pathname') || '';
  const pathInfo = store.get(`${store.prefix.PATH_INFO}${pathname}`);
  if (pathInfo) {
    me.innerHTML = generatePathItem(pathInfo);
  } else {
    me.remove();
  }
};

pathItem.createdCallback = function () {
  const me = this;
  me._setContent();
  const pathname = me.getAttribute('pathname') || '';
  store.on(`changed:${store.prefix.PATH_INFO}${pathname}`, () => {
    me._setContent();
  });
  store.on(`deleted:${store.prefix.PATH_INFO}${pathname}`, () => {
    me.remove();
  });
};

export default document.registerElement('path-item', {
  prototype: pathItem
});
