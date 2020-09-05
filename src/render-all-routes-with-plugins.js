import getRequestedPlugins from './get-requested-plugins';
import buildRenderRoutePipeline from './build-render-route-pipeline';
import executeRenderPipelineForRoute from './execute-render-pipeline-for-route';
import routeToFileName from './route-to-filename';

/**
 * Render all the routes using the specified plugins
 *
 * @param {Array<String>} routes
 * @param {String} indexHtml
 * @param {React.Component} component
 * @param {Array<String|import("./models").PluginDescriptor>} pluginDescriptors
 * @return {Array<import("./models").RenderedRoute>} The rendered routes
 */
const renderAllRoutesWithPlugins = async (
  routes,
  indexHtml,
  component,
  pluginDescriptors
) => {
  const plugins = getRequestedPlugins(pluginDescriptors);
  const pipeline = buildRenderRoutePipeline(plugins);

  return Promise.all(
    routes.map(async (route) => {
      const renderedRoute = await executeRenderPipelineForRoute(
        pipeline,
        route,
        indexHtml,
        component
      );
      return {
        route,
        renderedAs: renderedRoute,
        filename: routeToFileName(route),
      };
    })
  );
};

export default renderAllRoutesWithPlugins;
