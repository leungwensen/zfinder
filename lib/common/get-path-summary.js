'use strict';
/**
 * wrap-path-summary module
 * @module wrap-path-summary
 * @see module:index
 */
const fs = require('fs');
const lang = require('zero-lang');
const XMLLite = require('xml-lite');
const markdown2html = require('./markdown2html');

const extnames = [
  'markdown',
  'md',
];

module.exports = (pathInfo) => {
  const extname = pathInfo.extname;
  if (lang.contains(extnames, extname)) {
    pathInfo.content = fs.readFileSync(pathInfo.fullPath, {
      encoding: 'utf8'
    });
    if (extname === 'markdown' || extname === 'md') {
      const lines = pathInfo.content.split(/[\n\r]/);
      let i = 0;
      let summary = '';
      while (i < lines.length) {
        const line = lines[i];
        if (line) {
          // first line(header) as summary
          summary = lang.trim(line.replace(/^#*/, ''));
          break;
        }
        i++;
      }
      // FIXME: get content after parsing title into html
      if (summary) {
        const xml = markdown2html(summary);
        pathInfo.summary = XMLLite.getInnerXML(XMLLite.parse(xml).documentElement);
      }
    }
  }
  return pathInfo;
};
