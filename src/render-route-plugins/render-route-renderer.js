import { renderToString } from 'react-dom/server';

/**
 * Renders the wrapped component
 */
const RenderRouteRenderer = {
  /**
   * @type {import('../models').RenderCallback}
   */
  render: (wrappedComponent) => renderToString(() => wrappedComponent),

  /**
   * @type {import('../models').FinaliseCallback}
   */
  finalise: (_context, renderedComponent, indexHtml) => {
    return (
      '<!DOCTYPE html>\n' +
      indexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedComponent}</div>`
      )
    );
  },
};

export default RenderRouteRenderer;
