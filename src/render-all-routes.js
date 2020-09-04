import renderRoute from './render-route';

/**
 * Render all the routes
 *
 * @param {Array<String>} routes
 * @param {String} indexHtml
 * @param {React.Component} component
 * @return {Array<import("./models").RenderedRoute>} The rendered routes
 */
const renderAllRoutes = (routes, indexHtml, component) => {
  return routes.map((route) => {
    const renderedRoute = renderRoute(route, indexHtml, component);
    return { route, renderedAs: renderedRoute };
  });
};

export default renderAllRoutes;
