'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import lang from 'zero-lang';
import './index.less';
import Toc from './toc';
import generate from './generate';
import utils from './utils';

const main = lang.extend({
  Toc,
  generate,
}, utils);

lang.global.tg = lang.global.tocGenerator = main;

export default main;
