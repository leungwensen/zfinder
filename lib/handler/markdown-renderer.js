'use strict';
/**
 * markdown-renderer module
 * @module markdown-renderer
 * @see module:index
 */
// const httpErrors = require('http-errors');
const Handler = require('./base');
const markdown2html = require('../common/markdown2html');

const name = 'markdown-renderer';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute() {
    return (req, res, next) => {
      /*
       * params might affect handler:
       * {
       *    _handler: 'markdown-renderer',
       *    content: 'markdown language',
       * }
       */
      if (req._handler === name) {
        try {
          res._HTMLRes(markdown2html(req._params.content));
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
