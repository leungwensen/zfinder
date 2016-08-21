'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import './index.less';
import lang from 'zero-lang';

const breadCrumbs = Object.create(HTMLElement.prototype);

function parse(url) {
  url = url.replace(/\/$/, '');
  const parts = url.split('/');
  const host = parts[0] ? parts[0] : '';
  parts[0] = '/';

  function getPath(index) {
    let result = '';
    lang.some(parts, (part, i) => {
      result += (part === '/' ? '/' : `${part}/`);
      return index === i;
    });

    return result;
  }

  const items = [];

  lang.each(parts, (part, index) => {
    const path = getPath(index);
    items.push({
      first: index === 0,
      last: index === (parts.length - 1),
      name: part,
      path,
      url: host + path,
    });
  });

  return items;
}

function generateBreadCrumbs(url) {
  const items = parse(url);
  return `<a ${url === '/' || url === '' ? '' : 'href="/"'} class="header"><svg-icon type="home"></svg-icon></a>
    <svg-icon type="arrow-right" class="separator"></svg-icon>
  ${lang.map(items, (item) => {
    if (item.first || item.last) return '';
    return `<a class="item url" href="${item.url}">${item.name}</a>
      <svg-icon type="arrow-right" class="separator"></svg-icon>`;
  }).join('')}
${items.length > 1 ? `<a class="item current">${items[items.length - 1].name}</a>` : ''}`;
}

breadCrumbs._setContent = function () {
  const url = this.getAttribute('url') || '';
  this.innerHTML = generateBreadCrumbs(url);
};

breadCrumbs.createdCallback = function () {
  this._setContent();
};

breadCrumbs.attributeChangedCallback = function () {
  this._setContent();
};

export default document.registerElement('bread-crumbs', {
  prototype: breadCrumbs
});
