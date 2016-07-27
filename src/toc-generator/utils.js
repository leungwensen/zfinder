'use strict';
/**
 * utils module
 * @module utils
 * @see module:index
 */
import $ from 'jquery';
import lang from 'zero-lang';

function getHeaderLevel(header) {
  return lang.toInteger(header.tagName.replace(/h/i, ''));
}

function getHeaderText(header) {
  const text = $(header).text().replace(/[<>]/g, '');
  return text;
}

function getHeaderSelector(level) {
  let headers = [];
  for (let i = 1; i <= level; i++) {
    headers.push(`h${i}`);
  }
  return headers.join(',');
}

export {
  getHeaderLevel,
  getHeaderText,
  getHeaderSelector,
};
