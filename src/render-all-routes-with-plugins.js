import getRequestedPlugins from './get-requested-plugins';
import buildRenderRoutePipeline from './build-render-route-pipeline';
import executeRenderPipelineForRoute from './execute-render-pipeline-for-route';

/**
 * Render all the routes using the specified plugins
 *
 * @param {Array<String>} routes
 * @param {String} indexHtml
 * @param {React.Component} component
 * @param {Array<String>} pluginNames
 */
const renderAllRoutesWithPlugins = (
  routes,
  indexHtml,
  component,
  pluginNames
) => {
  const plugins = getRequestedPlugins(pluginNames);
  const pipeline = buildRenderRoutePipeline(plugins);
  return routes.map((route) => {
    const renderedRoute = executeRenderPipelineForRoute(
      pipeline,
      route,
      indexHtml,
      component
    );
    return { route, renderedAs: renderedRoute };
  });
};

export default renderAllRoutesWithPlugins;
