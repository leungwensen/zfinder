'use strict';
/**
 * markdown2html module
 * @module markdown2html
 * @see module:index
 */
const fs = require('fs');
const path = require('path');
const markdown2html = require('../lib/common/markdown2html');

console.log(
  markdown2html(fs.readFileSync(path.resolve(__dirname, './fixtures/git-dot.md'), 'utf8'))
);
