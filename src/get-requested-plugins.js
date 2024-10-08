/**
 * @param {Array<String|require("./models").PluginDescriptor>} pluginDescriptors
 * @return {Array<require("./models").PluginWrapper>} The list of requested plugins
 */
const getRequestedPlugins = (pluginDescriptors) => {
  if (!pluginDescriptors) pluginDescriptors = [];

  pluginDescriptors.unshift('renderer');

  return pluginDescriptors
    .map((pluginDescriptor) => {
      const pluginDescriptorX = getPluginDescriptor(pluginDescriptor);
      switch (pluginDescriptorX.name) {
        case 'renderer':
          const RenderRouteRenderer = require('./render-route-plugins/render-route-renderer');
          return {
            name: pluginDescriptorX.name,
            plugin: RenderRouteRenderer,
            options: pluginDescriptorX.options,
          };
        case 'react-router':
          const RenderRouteWithReactRouter = require('./render-route-plugins/render-route-with-react-router');
          return {
            name: pluginDescriptorX.name,
            plugin: RenderRouteWithReactRouter,
            options: pluginDescriptorX.options,
          };
        case 'helmet':
          const RenderRouteWithHelmet = require('./render-route-plugins/render-route-with-helmet');
          return {
            name: pluginDescriptorX.name,
            plugin: RenderRouteWithHelmet,
            options: pluginDescriptorX.options,
          };
        case 'apollo':
          const RenderRouteWithApollo = require('./render-route-plugins/render-route-with-apollo');
          return {
            name: pluginDescriptorX.name,
            plugin: RenderRouteWithApollo,
            options: pluginDescriptorX.options,
          };
        case 'firebase': {
          return {
            name: pluginDescriptorX.name,
            plugin: {},
            options: {},
          };
        }
      }
    })
    .filter(Boolean);
};

/**
 * @param {String|require("./models").PluginDescriptor} pluginDescriptor
 */
const getPluginDescriptor = (pluginDescriptor) => {
  if (typeof pluginDescriptor === 'string')
    return { name: pluginDescriptor, options: {} };
  if (typeof pluginDescriptor === 'object' && pluginDescriptor.length === 2)
    return { name: pluginDescriptor[0], options: pluginDescriptor[1] };
  throw new Error(`Invalid plugin format ${pluginDescriptor}`);
};

module.exports = { getRequestedPlugins, getPluginDescriptor };
