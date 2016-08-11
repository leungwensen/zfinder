'use strict';
/**
 * Store module
 * @module Store
 * @see module:index
 */
import lang from 'zero-lang';
import Store from '../common/store/base';

const store = new Store();

lang.extend(store, {
  prefix: {
    PATH_INFO: 'path-',
  }
});

export default store;
