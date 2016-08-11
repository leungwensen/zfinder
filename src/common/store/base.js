import EventEmitter from 'wolfy87-eventemitter';
import lang from 'zero-lang';

class Store extends EventEmitter {
  constructor(options) {
    super();
    const me = this;
    lang.extend(me, options);
    me.storage = me.storage || {};
  }

  get(name, defaultValue) {
    const value = this.storage[name];
    return lang.isUndefined(value) ? defaultValue : value;
  }

  set(name, value) {
    const me = this;
    const oldVal = me.get(name);
    console.log(name, value, oldVal);
    if (oldVal !== value) {
      me.storage[name] = value;
      me.emit(`changed:${name}`, value);
      me.emit('changed', name, value);
    }
  }

  del(name) {
    const me = this;
    delete me.storage[name];
    me.emit(`deleted:${name}`);
  }

  clear() {
    const me = this;
    me.storage = {};
    me.emit('cleared');
  }
}

export default Store;
