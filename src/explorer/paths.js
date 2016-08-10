'use strict';
/**
 * paths module
 * @module paths
 * @see module:index
 */
import $ from 'jquery';
import lang from 'zero-lang';
import './path-item-element/index';
import readDirCgi from '../cgi/read-dir';
import store from './store';

const $paths = $('#paths');

export default {
  render(pathname) {
    readDirCgi(pathname, (err, res) => {
      if (!err && res.ok) {
        const paths = res.body;
        console.log(paths);
        lang.each(paths, (pathInfo) => {
          store.set(`${store.prefix.PATH_INFO}${pathInfo.relativePath}`, pathInfo);
        });
        $paths.html(
          lang.map(paths, (pathInfo) => `<path-item pathname="${pathInfo.relativePath}"></path-item>`).join('')
        );
      }
    })
  },
  renderByQuery(pathname, query) {
  }
}
