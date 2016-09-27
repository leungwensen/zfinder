'use strict';
/**
 * index module
 * @module index
 * @see module:index
 */
import './index.less';
import $ from 'jquery';
import screenfull from 'screenfull';
import lang from 'zero-lang';
import routie from '../common/routie';
import tg from '../common/toc-generator/index';
import loading from '../common/loading/index';

const $toc = $('#toc');
const $tocBody = $('#toc-body');
const $markdownBody = $('#markdown-body');
const $toggleToc = $('#toggle-toc');
const $toggleFullscreenArticle = $('#toggle-fullscreen-article');

const toc = tg.generate($markdownBody[0], {
  maxDepth: 6,
});
$tocBody.append(toc.$outerDomNode);

$(window).on('load', () => {
  routie('*', (uniqueId) => {
    toc.scrollTo(uniqueId);
  });

  toc.on('clicked', (headerMeta) => {
    console.log(headerMeta);
    lang.global.location = `#${headerMeta.uniqueId}`;
  });

  loading.hide();
});

$toggleToc.click(() => {
  if ($toc.is(':visible')) {
    $toc.hide();
    $toggleToc.html('<use xlink:href="#si-zfinder-expand-right"></use>');
  } else {
    $toc.show();
    $toggleToc.html('<use xlink:href="#si-zfinder-collapse-left"></use>');
  }
});

if (screenfull.enabled) {
  $toggleFullscreenArticle.click(() => {
    screenfull.toggle(document.documentElement);
  });
  document.addEventListener(screenfull.raw.fullscreenchange, () => {
    if (screenfull.isFullscreen) {
      $toggleFullscreenArticle.html('<use xlink:href="#si-zfinder-fullscreen-exit"></use>');
    } else {
      $toggleFullscreenArticle.html('<use xlink:href="#si-zfinder-fullscreen"></use>');
    }
  });
} else {
  $toggleFullscreenArticle.hide();
}
