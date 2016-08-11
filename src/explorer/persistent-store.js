'use strict';
/**
 * persistentStore module
 * @module persistentStore
 * @see module:index
 */
import PersistentStore from '../common/store/persistent';

export default new PersistentStore({
  prefix: 'explorer-',
});
