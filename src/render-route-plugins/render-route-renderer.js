const { renderToString } = require('react-dom/server');
const { jsxify } = require('../utils');

/**
 * Renders the wrapped component
 * @type {require('../models').Plugin}
 */
const RenderRouteRenderer = {
  /**
   * @type {require('../models').RenderCallback}
   */
  render: (wrappedComponent) => renderToString(jsxify(wrappedComponent)),

  /**
   * @type {require('../models').FinaliseCallback}
   */
  finalise: (_context, renderedComponent, indexHtml) =>
    '<!DOCTYPE html>\n' +
    indexHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${renderedComponent}</div>`
    ),
};

module.exports = RenderRouteRenderer;
