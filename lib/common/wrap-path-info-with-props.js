'use strict';
/**
 * wrap-path-info-with-props module
 * @module wrap-path-info-with-props
 * @see module:index
 */
const lang = require('zero-lang');
const getExtname = require('./get-extname');
const getIcon = require('./get-icon-by-path-info');
const getLanguageByFilename = require('./get-language-by-filename');
const getType = require('./get-type-by-path-info');
const isBinary = require('./is-binary');
const isCode = require('./is-code');
const isHidden = require('./is-hidden');

const handledLanguages = [
  'HTML',
  'Markdown',
  'SVG',
];
const handledExts = [
  'dot',
  'plantuml',
  'xmind',
];

module.exports = (root, relativePath, fullPath, filename, stats) => {
  const info = lang.extend({}, stats, {
    basename: filename,
    extname: getExtname(filename),
    fullPath,
    isBinary: isBinary(filename),
    isCode: isCode(filename),
    isDirectory: stats.isDirectory(),
    isHidden: isHidden(filename),
    relativePath,
    root,
  });
  info.type = getType(info);
  info.icon = getIcon(info);
  info.previewLink = `/${relativePath}${info.isDirectory ? '/' : ''}`;
  const language = getLanguageByFilename(info.basename);
  if (!info.isDirectory && !info.isBinary
    && !lang.contains(handledLanguages, language.name)
    && !lang.contains(handledExts, info.extname)) {
    info.previewLink += '?_handler=text-editor';
  }
  return info;
};
