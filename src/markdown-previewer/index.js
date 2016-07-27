'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
require('./index.less');
import $ from 'jquery';
import lang from 'zero-lang';
import routie from '../common/routie';
import tg from '../toc-generator/index';

const $toc = $('#toc');
const $markdownBody = $('#markdown-body');

const toc = tg.generate($markdownBody[0], {
  maxDepth: 6,
});
$toc.append(toc.$outerDomNode);

routie('*', function (uniqueId) {
  toc.scrollTo(uniqueId);
});

toc.on('clicked', (headerMeta) => {
  lang.global.location = '#' + headerMeta.uniqueId;
});
