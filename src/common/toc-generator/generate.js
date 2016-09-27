'use strict';
/**
 * generate module
 * @module generate
 * @see module:index
 */
import $ from 'jquery';
import lang from 'zero-lang';
import Toc from './toc';
import {
  DEFAULT_OPTIONS
} from './const';
import {
  getHeaderLevel,
  getHeaderSelector,
  getHeaderText
} from './utils';
import htmlEncoding from '../html-encoding';

const body = document.body;

function locationCallback() {
  const $target = $(this);
  const uniqueId = $target.data('unique');
  lang.global.location = `#${uniqueId}`;
  $target[0].scrollIntoView(true);
}

function generate(element = body, options = {}) {
  options = lang.extend({}, DEFAULT_OPTIONS, options);
  const $element = $(element);
  const links = [];
  const $headers = $element.find(getHeaderSelector(options.maxDepth));
  const headerMetaById = {};
  const uniqueIdSeparator = options.uniqueIdSeparator;

  function getHeaderUniqueId(text) {
    const id = htmlEncoding.unescape(text)
      .replace(/"/g, uniqueIdSeparator)
      .replace(/&/g, uniqueIdSeparator)
      .replace(/'/g, uniqueIdSeparator)
      .replace(/</g, uniqueIdSeparator)
      .replace(/>/g, uniqueIdSeparator)
      .replace(/\(/g, uniqueIdSeparator)
      .replace(/\)/g, uniqueIdSeparator)
      .replace(/\//g, uniqueIdSeparator)
      .replace(/\\/g, uniqueIdSeparator)
      .replace(/\s+/g, uniqueIdSeparator);
    const resultId = options.uniqueIdPrefix + id;

    if (!lang.hasKey(headerMetaById, resultId)) return resultId;

    return getHeaderUniqueId(id + options.uniqueIdSuffix);
  }

  lang.each($headers, (header) => {
    const level = getHeaderLevel(header);
    const text = getHeaderText(header);
    const uniqueId = getHeaderUniqueId(text);
    const meta = {
      text,
      uniqueId,
      level,
    };
    const $anchorElement = $(`<span class="toc-anchor" data-unique="${meta.uniqueId}">&#9875;</span>`);
    meta.$anchorElement = $anchorElement;
    $(header).prepend($anchorElement);
    headerMetaById[uniqueId] = meta;
    links.push(meta);
  });

  const toc = new Toc(links, lang.extend({
    srcElement: $element[0],
  }, options));

  $element.on('click', '.toc-anchor', locationCallback);
  return toc;
}

export default generate;
