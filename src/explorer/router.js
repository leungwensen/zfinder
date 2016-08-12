'use strict';
/**
 * router module
 * @module router
 * @see module:index
 */
import $ from 'jquery';
import queryString from 'query-string';
import store from './store';
import paths from './paths';
import globalVars from '../common/global-variables';

const $basename = $('#basename');
const $breadCrumbs = $('bread-crumbs');
const $btnBack = $('#btn-back');
const $query = $('search-bar input');
const $btnMore = $('#btn-more');
let actionPanel;

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
});
store.on('changed:query', (value) => {
  $query.val(value);
});
store.on('changed:showActionPanel', (value) => {
  if (value) {
    actionPanel && actionPanel.open();
    // init actionPanel
  } else {
    actionPanel && actionPanel.close();
  }
});

$btnMore.on('click', () => {
  store.set('showActionPanel', !store.get('showActionPanel'));
});

function getBasename(pathname) {
  const parts = pathname.replace(/\/$/, '').split('/');
  return parts[parts.length - 1];
}

function updateLink(link) {
  const url = link.href;
  if (url) {
    const pathname = link.pathname;
    let basename = getBasename(pathname);
    if (basename === '' && pathname === '/') basename = getBasename(globalVars.pathInfo.root);
    store.set('basename', basename);
    store.set('relativePath', pathname);
    const query = queryString.parse(link.search).query;
    if (query) {
      store.set('query', query);
      paths.renderByQuery(pathname, query);
    } else {
      paths.render(pathname);
    }
  }
}

updateLink(location);
