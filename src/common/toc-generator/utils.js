'use strict';
/**
 * utils module
 * @module utils
 * @see module:index
 */
import $ from 'jquery';
import lang from 'zero-lang';
import htmlEncoding from '../html-encoding';

function getHeaderLevel(header) {
  return lang.toInteger(header.tagName.replace(/h/i, ''));
}

function getHeaderText(header) {
  const text = htmlEncoding.escape($(header).text());
  return text;
}

function getHeaderSelector(level) {
  const headers = [];
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
