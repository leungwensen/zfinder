'use strict';
/**
 * dot-renderer module
 * @module dot-renderer
 * @see module:index
 */
const Handler = require('./base');
const viz = require('viz.js');

const name = 'dot-renderer';

module.exports = new Handler({
  method: 'get',
  name,
  url: '*',
  toRoute() {
    return (req, res, next) => {
      /*
       * params might affect handler:
       * {
       *    _handler: 'dot-renderer',
       *    content: 'dot language',
       * }
       */
      if (req._handler === name) {
        const content = req._params.content;
        try {
          const svg = viz(content, {
            format: 'svg',
            engine: 'dot',
          });
          res._sendRes(svg, 'image/svg+xml');
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    };
  }
});
