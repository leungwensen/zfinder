'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import './index.less';
import $ from 'jquery';
import lang from 'zero-lang';
import routie from '../common/routie';
import tg from '../common/toc-generator/index';
import loading from '../common/loading/index';

const $tocBody = $('#toc-body');
const $markdownBody = $('#markdown-body');

const toc = tg.generate($markdownBody[0], {
  maxDepth: 6,
});
$tocBody.append(toc.$outerDomNode);

$(window).on('load', () => {
  routie('*', (uniqueId) => {
    toc.scrollTo(uniqueId);
  });

  toc.on('clicked', (headerMeta) => {
    lang.global.location = `#${headerMeta.uniqueId}`;
  });

  loading.hide();
});

