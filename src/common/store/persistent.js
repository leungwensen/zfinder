'use strict';
/**
 * PersistentStore module
 * @module PersistentStore
 * @see module:index
 */
import EventEmitter from 'wolfy87-eventemitter';
import lang from 'zero-lang';
import try2get from 'try2get';

console.log(try2get);

const webStorage = try2get.one(
  () => window.localStorage,
  () => window.window.sessionStorage
);

class Store extends EventEmitter {
  constructor(options) {
    super();
    const me = this;
    lang.extend(me, options);
    me.storage = me.storage || webStorage;
    me.prefix = me.prefix || ''; // persistent stores has prefixes
  }

  get(name, defaultValue) {
    const me = this;
    name = `${me.prefix}${name}`;
    const value = me.storage[name];
    if (lang.isString(value)) {
      return JSON.parse(value);
    }
    return defaultValue;
  }

  set(n, value) {
    const me = this;
    const name = `${me.prefix}${n}`;
    const oldVal = me.get(name);
    const newVal = JSON.stringify(value);
    console.log(name, value, oldVal);
    if (oldVal !== newVal) {
      me.storage[name] = newVal;
      me.emit(`changed:${n}`, value);
      me.emit('changed', n, value);
    }
  }

  del(name) {
    const me = this;
    name = `${me.prefix}${name}`;
    me.storage.removeItem(name);
    me.emit(`deleted:${name}`);
  }

  clear() {
    const me = this;
    me.storage.clear();
    me.emit('cleared');
  }
}

export default Store;
