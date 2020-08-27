import { renderToString } from 'react-dom/server';
import { jsxify } from '../utils';

/**
 * Renders the wrapped component
 * @type {import('../models').Plugin}
 */
const RenderRouteRenderer = {
  /**
   * @type {import('../models').RenderCallback}
   */
  render: (wrappedComponent) => renderToString(jsxify(wrappedComponent)),

  /**
   * @type {import('../models').FinaliseCallback}
   */
  finalise: (_context, renderedComponent, indexHtml) =>
    '<!DOCTYPE html>\n' +
    indexHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${renderedComponent}</div>`
    ),
};

export default RenderRouteRenderer;
export { RenderRouteRenderer };
