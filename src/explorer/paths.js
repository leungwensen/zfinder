'use strict';
/**
 * paths module
 * @module paths
 * @see module:index
 */
import $ from 'jquery';
import './path-element/index';
import readDirCgi from '../cgi/read-dir';

const $paths = $('#paths');

export default {
  render(pathname) {
    readDirCgi(pathname, (err, res) => {
      if (!err && res.ok) {
        console.log(res.body);
        $paths.html('');
      }
    })
  },
  renderByQuery(pathname, query) {
  }
}
