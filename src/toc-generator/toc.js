'use strict';
/**
 * toc module
 * @module toc
 * @see module:index
 */
import $ from 'jquery';
import lang from 'zero-lang';
import EventEmitter from 'wolfy87-eventemitter';
import {
  DEFAULT_OPTIONS
} from './const';

const extend = lang.extend;
const body = document.body;

const linkListMarkup = '<ul class="toc-link-list"></ul>';

function addHeaderExpander(header, options) {
  if (!header.$expanderElement) {
    header.$element.prepend(`<span class="${options.expanderClassName}" data-unique="${header.uniqueId}">
    &blacktriangledown;
</span>`);
    header.$expanderElement = header.$element.find(`.${options.expanderClassName}`);
  }
}

function toggleHeaderExpanderText(header, options, isExpanded) {
  header.$expanderElement.html(isExpanded ? options.expanderExpandedText : options.expanderText);
}

class Toc extends EventEmitter {
  constructor(links, options) {
    super();
    const me = this;
    me.options = extend({}, DEFAULT_OPTIONS, options);
    me.render(links);
    me.bindEvents();
    me.$srcElement = $(me.options.srcElement || body);
    return me;
  }

  render(links) {
    const me = this;
    const options = me.options;
    const $tocElement = me.$outerDomNode = $(linkListMarkup);
    const headerMetaById = {};
    let currentHeaderMeta;

    function addToChildren(headerMeta, parentHeaderMeta) {
      let $childrenElement = parentHeaderMeta.$element.children('ul');
      if (!$childrenElement[0]) {
        $childrenElement = $(linkListMarkup);
        parentHeaderMeta.$element.append($childrenElement);
      }

      $childrenElement.append(headerMeta.$element);
      headerMeta.parentId = parentHeaderMeta.uniqueId;
      parentHeaderMeta.children.push(headerMeta.uniqueId);
      parentHeaderMeta.$childrenElement = $childrenElement;
      addHeaderExpander(parentHeaderMeta, options);
    }

    lang.each(links, function (meta) {
      lang.extend(meta, {
        isExpanded: true,
        expanderClassName: options.expanderClassName,
        textClassName: options.textClassName,
        children: [],
      });
      let level = meta.level;
      let $linkElement = $(`<li class="toc-link level${level}">
    <a class="${meta.textClassName}" data-unique="${meta.uniqueId}">${meta.text}</a>
</li>`);
      meta.$element = $linkElement;
      if (currentHeaderMeta) {
        if (currentHeaderMeta.level < level) { // NOTICE that "h2 < h1"
          meta.parentId = currentHeaderMeta.uniqueId;
          addToChildren(meta, currentHeaderMeta);
        } else {
          let parentMeta = headerMetaById[currentHeaderMeta.parentId];
          while (parentMeta) {
            if (parentMeta.level >= level) {
              parentMeta = headerMetaById[parentMeta.parentId];
            } else {
              break;
            }
          }
          if (parentMeta) {
            addToChildren(meta, parentMeta);
          } else {
            $tocElement.append($linkElement);
          }
        }
      } else {
        $tocElement.append($linkElement);
      }

      currentHeaderMeta = meta;
      headerMetaById[meta.uniqueId] = meta;
    });

    lang.forIn(headerMetaById, function (meta) {
      if (meta.children.length) {
        meta.$element.addClass(options.hasChildClassName);
      }
    });

    me.headerMetaById = headerMetaById;

    return me;
  }

  bindEvents() {
    const me = this;
    const options = me.options;

    me.$outerDomNode.on('click', `.${options.expanderClassName}`, function () {
      const $target = $(this);
      const uniqueId = $target.data('unique');
      const headerMeta = me.headerMetaById[uniqueId];
      me.expandOrCollapse(uniqueId);
      if (headerMeta.isExpanded) {
        me.emit('expanded', headerMeta);
      } else {
        me.emit('collapsed', headerMeta);
      }
    });

    me.$outerDomNode.on('click', `.${options.textClassName}`, function () {
      const $target = $(this);
      const uniqueId = $target.data('unique');
      me.scrollTo(uniqueId);
      me.emit('clicked', me.headerMetaById[uniqueId]);
    });
    return me;
  }

  expand(id) {
    const me = this;
    const header = me.headerMetaById[id];
    if (header && header.$childrenElement) {
      header.$childrenElement.show();
      toggleHeaderExpanderText(header, me.options, true);
      header.isExpanded = true;
    }
    return me;
  }

  collapse(id) {
    const me = this;
    const header = me.headerMetaById[id];
    if (header && header.$childrenElement) {
      header.$childrenElement.hide();
      toggleHeaderExpanderText(header, me.options);
      header.isExpanded = false;
    }
    return me;
  }

  expandOrCollapse(id) {
    let me = this;
    let header = me.headerMetaById[id];
    if (header) me[header.isExpanded ? 'collapse' : 'expand'](id);
    return me;
  }

  scrollTo(uniqueId) {
    const me = this;
    const anchorSelector = `.toc-anchor[data-unique="${uniqueId}"]`;
    try {
      const $anchorNode = me.$srcElement.find(anchorSelector);
      if ($anchorNode[0]) $anchorNode[0].scrollIntoView(true);
    } catch (e) {
    }
    return me;
  }
}

export default Toc;
