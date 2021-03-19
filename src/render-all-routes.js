const renderRoute = require('./render-route');

/**
 * Render all the routes
 *
 * @param {Array<String>} routes
 * @param {String} indexHtml
 * @param {React.Component} component
 * @return {Array<require("./models").RenderedRoute>} The rendered routes
 */
const renderAllRoutes = (routes, indexHtml, component) => {
  return routes.map((route) => {
    const renderedRoute = renderRoute(route, indexHtml, component);
    return { route, renderedAs: renderedRoute };
  });
};

module.exports = renderAllRoutes;
