const { getRequestedPlugins } = require('./get-requested-plugins');
const buildRenderRoutePipeline = require('./build-render-route-pipeline');
const executeRenderPipelineForRoute = require('./execute-render-pipeline-for-route');
const routeToFileName = require('./route-to-filename');

/**
 * Render all the routes using the specified plugins
 *
 * @param {Array<String>} routes
 * @param {String} indexHtml
 * @param {React.Component} component
 * @param {Array<String|require("./models").PluginDescriptor>} pluginDescriptors
 * @return {Array<require("./models").RenderedRoute>} The rendered routes
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

module.exports = renderAllRoutesWithPlugins;
