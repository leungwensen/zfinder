'use strict';
/**
 * paths module
 * @module paths
 * @see module:index
 */
import $ from 'jquery';
import lang from 'zero-lang';
import './path-item-element/index';
import persistentStore from './persistent-store';
import readDirCgi from '../cgi/read-dir';
import store from './store';

const $paths = $('#paths');

let currentPaths = [];
const DEFAULT_VIEW = 'detail';
const VIEW_CLASSES = 'detail card tile';

function syncStats() {
  // view
  const view = persistentStore.get('paths-view', DEFAULT_VIEW);
  $paths.removeClass(VIEW_CLASSES).addClass(view);
}
lang.each([
  'paths-view',
], (key) => {
  persistentStore.on(`changed:${key}`, syncStats);
});
syncStats();

function syncPaths() {
  // stats
  syncStats();
  // sort-by
  // sort-order
  $paths.html(
    lang.map(currentPaths, (pathInfo) => `<path-item pathname="${pathInfo.relativePath}"></path-item>`).join('')
  );
}
lang.each([
  'paths-sort-by',
  'paths-sort-order',
], (key) => {
  persistentStore.on(`changed:${key}`, syncStats);
});

export default {
  render(pathname) {
    readDirCgi(pathname, (err, res) => {
      if (!err && res.ok) {
        const paths = res.body;
        lang.each(paths, (pathInfo) => {
          store.set(`${store.prefix.PATH_INFO}${pathInfo.relativePath}`, pathInfo);
        });
        currentPaths = paths;
        syncPaths();
      }
    });
  },
  renderByQuery(/* pathname, query */) {
  },
  filter() {
  }
};
