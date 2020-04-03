import renderRoute from './render-route';

const renderAllRoutes = (routes, indexHtml, component) => {
  return routes.map((route) => {
    const renderedRoute = renderRoute(route, indexHtml, component);
    return { route, renderedAs: renderedRoute };
  });
};

export default renderAllRoutes;
