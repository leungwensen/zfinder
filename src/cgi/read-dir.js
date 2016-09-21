'use strict';
/**
 * read-dir module
 * @module read-dir
 * @see module:index
 */
import request from 'superagent';

export default (pathname, callback) => {
  request.get(pathname)
    .set('Accept', 'application/json')
    .query({
      _handler: 'read-dir',
      summary: true,
    })
    .end(callback);
};
