'use strict';
/**
 * router module
 * @module router
 * @see module:index
 */
import $ from 'jquery';
import store from './store';
import paths from './paths';
import globalVars from '../common/global-variables';

const $basename = $('#basename');
const $breadCrumbs = $('bread-crumbs');
const $btnBack = $('#btn-back');
const $filter = $('#paths-filter input');
const $clearFilter = $('#paths-filter .btn-clear');
const $btnMore = $('#btn-more');
let actionPanel;

store.on('changed:basename', (value) => {
  $basename.html(value);
  document.title = value;
});
store.on('changed:relative-path', (value) => {
  $breadCrumbs.attr('url', value);
  if (value === '/') {
    $btnBack.removeAttr('href');
    $btnBack.addClass('disabled');
  } else {
    $btnBack.attr('href', '../');
    $btnBack.removeClass('disabled');
  }
});
store.on('changed:show-action-panel', (value) => {
  if (value) {
    if (actionPanel) {
      actionPanel.open();
    }
    // init actionPanel
  } else if (actionPanel) {
    actionPanel.close();
  }
});

$btnMore.on('click', () => {
  store.set('show-action-panel', !store.get('show-action-panel'));
});
$filter.on('input', () => {
  store.set('paths-filter', $filter.val());
});
$clearFilter.on('click', () => {
  store.set('paths-filter', '');
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
    store.set('relative-path', pathname);
    paths.render(pathname);
  }
}

updateLink(location);
