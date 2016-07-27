'use strict';
/**
 * get-title-from-html module
 * @module get-title-from-html
 * @see module:index
 */
module.exports = (html, defaultTitle) => {
  const matched = /<h1>(.+)<\/h1>/.exec(html || '');
  if (matched) {
    return matched[1].replace(/<[^>]+>/g, '');
  }
  return defaultTitle || '';
};
