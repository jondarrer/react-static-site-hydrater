import getRequestedPlugins from './get-requested-plugins';
import buildRenderRoutePipeline from './build-render-route-pipeline';
import executeRenderPipelineForRoute from './execute-render-pipeline-for-route';

/**
 * Render all the routes using the specified plugins
 *
 * @param {Array<String>} routes
 * @param {String} indexHtml
 * @param {React.Component} component
 * @param {Array<String|import("./models").PluginDescriptor>} pluginDescriptors
 */
const renderAllRoutesWithPlugins = (
  routes,
  indexHtml,
  component,
  pluginDescriptors
) => {
  const plugins = getRequestedPlugins(pluginDescriptors);
  console.log('renderAllRoutesWithPlugins', 'getRequestedPlugins', {
    pluginDescriptors,
    plugins,
  });
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
