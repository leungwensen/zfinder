'use strict';
/**
 * plantuml-renderer module
 * @module plantuml-renderer
 * @see module:index
 */
const Handler = require('./base');
const plantuml2svg = require('../common/plantuml2svg');

const name = 'plantuml-renderer';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute() {
    return (req, res, next) => {
      /*
       * params might affect handler:
       * {
       *    _handler: 'plantuml-renderer',
       *    content: 'plantuml language',
       * }
       */
      if (req._handler === name) {
        try {
          res._sendRes(plantuml2svg(req._params.content), 'image/svg+xml');
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
