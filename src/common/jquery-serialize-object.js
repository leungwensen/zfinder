'use strict';
/**
 * jquery-serialize-object module
 * @module jquery-serialize-object
 * @see module:index
 */

$.fn.serializeObject = function () {
  const o = {};
  const a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
