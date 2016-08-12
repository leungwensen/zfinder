'use strict';
/**
 * markdown2html module
 * @module markdown2html
 * @see module:index
 */
const hljs = require('highlight.js');
const markdownIt = require('markdown-it');
const viz2svg = require('../common/viz2svg');
const plantuml2svg = require('../common/plantuml2svg');

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) { // hacking
    if (lang) {
      // viz
      const matchedViz = /^viz\-(\w+)/.exec(lang);
      if (matchedViz) {
        try {
          return `<pre></pre><div class="viz-graph">${viz2svg(str, matchedViz[1])}</div>`;
        } catch (e) {
          return `<pre><code>${e}</code></pre>`;
        }
      }

      // plantuml
      if (/plantuml/.test(lang)) {
        try {
          return `<pre></pre><div class="plantuml">${plantuml2svg(str)}</div>`;
        } catch (e) {
          return `<pre><code>${e}</code></pre>`;
        }
      }

      // highlight
      if (hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return ''; // use external default escaping
  }
})
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-checkbox'))
  // .use(require('markdown-it-container')) // TODO use this to render viz/plantuml, etc.
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-implicit-figures'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-math'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'));

module.exports = (str) => md.render(str).replace(/<pre><\/pre>/g, ''); // TODO this is far too HACKY
