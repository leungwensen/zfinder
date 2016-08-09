'use strict';
/**
 * paths module
 * @module paths
 * @see module:index
 */
import readDirCgi from '../cgi/read-dir';

export default {
  render(pathname) {
    readDirCgi(pathname, (err, res) => {
      if (!err && res.ok) {
        console.log(res.body);
      }
    })
  },
  renderByQuery(pathname, query) {
  }
}
