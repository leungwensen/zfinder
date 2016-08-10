'use strict';
/**
 * language-by-extname module
 * @module language-by-extname
 * @see module:index
 */
const lang = require('zero-lang');
const languages = require('../data/languages.json'); // this file is borrowed from the adobe/bracket project

const languageByExtname = {
  unknown: languages.unknown,
};

lang.forIn(languages, (language, key) => {
  lang.each(language.fileExtensions || [], (ext) => {
    languageByExtname[ext] = {
      isBinary: language.isBinary,
      key,
      mode: language.mode,
      name: language.name,
    };
  });
});

module.exports = (extname) => languageByExtname[extname] || languageByExtname.unknown;
