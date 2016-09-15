'use strict';
/**
 * markdown2preview-html module
 * @module markdown2preview-html
 * @see module:index
 */
const path = require('path');
const markdown2html = require('./markdown2html');
const getTitleFromHtml = require('./get-title-from-html');
const template = require('../template/markdown-previewer');

module.exports = (markdown, defaultTitle, rc) => {
  const body = markdown2html(markdown);
  const title = getTitleFromHtml(body, defaultTitle);
  return template({
    body,
    rc,
    title,
  });
};

