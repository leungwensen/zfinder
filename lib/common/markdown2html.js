'use strict';
/**
 * markdown2html module
 * @module markdown2html
 * @see module:index
 */
const hljs = require('highlight.js');
const markdownIt = require('markdown-it');
const path = require('path');
const shelljs = require('shelljs');
const viz = require('viz.js');

const plantumlJAR = path.resolve(__dirname, '../../bin/plantuml.jar');
const plantumlCMD = `java -jar ${plantumlJAR} -charset "utf8" -nbthread auto -quiet -failfast2 -tsvg -pipe`;

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) { // hacking
    if (lang) {
      const matchedViz = /^viz\-(\w+)/.exec(lang);
      if (matchedViz) {
        const engine = matchedViz[1];
        try {
          const result = viz(str, {
            engine,
            format: 'svg',
          });
          return `<pre></pre><div class="viz-graph">${result}</div>`;
        } catch (e) {
          return `<pre><code>${e}</code></pre>`;
        }
      }

      if (/plantuml/.test(lang)) {
        const t = Date.now();
        try {
          const svg = shelljs.echo(str).exec(plantumlCMD, {
            silent: true,
          }).stdout;
          console.log(Date.now() - t);
          return `<pre></pre><div class="plantuml">${svg}</div>`
        } catch (e) {
          return `<pre><code>${e}</code></pre>`;
        }
      }

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
  .use(require('markdown-it-container')) // TODO use this to render viz
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-implicit-figures'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-math'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'));

module.exports = (str) => md.render(str).replace(/<pre><\/pre>/g, ''); // TODO this is far too HACKING
