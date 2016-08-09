'use strict';
/**
 * router module
 * @module router
 * @see module:index
 */
import $ from 'jquery';
import page from 'page';
import queryString from 'query-string';
import store from './store';
import paths from './paths';
import globalVars from '../common/global-variables';

const $basename = $('#basename');
const $breadCrumbs = $('bread-crumbs');
const $btnBack = $('#btn-back');

store.on('changed:basename', (value) => {
  $basename.html(value);
  document.title = value;
});
store.on('changed:relativePath', (value) => {
  $breadCrumbs.attr('url', value);
  if (value === '/') {
    $btnBack.removeAttr('href');
    $btnBack.addClass('disabled');
  } else {
    $btnBack.attr('href', '../');
    $btnBack.removeClass('disabled');
  }
  paths.render(value);
});
store.on('changed:query', (value) => {
});

function updateLink(link) {
  const url = link.href;
  if (url) {
    if (url !== location.href) {
      page(url);
    }
    const pathname = link.pathname;
    const parts = pathname.replace(/\/$/, '').split('/');
    const basename = parts[parts.length - 1];
    store.set('basename', basename);
    store.set('relativePath', pathname);
    const query = queryString.parse(link.search);
    if (query.query) {
      store.set('query', query.query);
    }
  }
}

$(document).on('click', 'a', function (e) {
  const link = e.currentTarget;
  if (link.href) {
    updateLink(e.currentTarget);
    e.preventDefault();
  }
});
page('*', (args) => {
  updateLink(location);
  console.log(args);
});
page();
updateLink(location);
