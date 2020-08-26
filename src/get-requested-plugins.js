/**
 * @param {Array<String|import("./models").PluginDescriptor>} pluginDescriptors
 * @return {Array<import("./models").PluginWrapper>} The list of requested plugins
 */
const getRequestedPlugins = (pluginDescriptors) => {
  if (!pluginDescriptors) pluginDescriptors = [];

  pluginDescriptors.unshift('renderer');

  return pluginDescriptors.map((pluginDescriptor) => {
    const pluginDescriptorX = getPluginDescriptor(pluginDescriptor);
    switch (pluginDescriptorX.name) {
      case 'renderer':
        const { RenderRouteRenderer } = require('./render-route-plugins');
        return {
          name: pluginDescriptorX.name,
          plugin: RenderRouteRenderer,
          options: pluginDescriptorX.options,
        };
      case 'react-router':
        const {
          RenderRouteWithReactRouter,
        } = require('./render-route-plugins');
        return {
          name: pluginDescriptorX.name,
          plugin: RenderRouteWithReactRouter,
          options: pluginDescriptorX.options,
        };
      case 'helmet':
        const { RenderRouteWithHelmet } = require('./render-route-plugins');
        return {
          name: pluginDescriptorX.name,
          plugin: RenderRouteWithHelmet,
          options: pluginDescriptorX.options,
        };
      case 'apollo':
        const { RenderRouteWithApollo } = require('./render-route-plugins');
        return {
          name: pluginDescriptorX.name,
          plugin: RenderRouteWithApollo,
          options: pluginDescriptorX.options,
        };
    }
  });
};

/**
 * @param {String|import("./models").PluginDescriptor} pluginDescriptor
 */
const getPluginDescriptor = (pluginDescriptor) => {
  if (typeof pluginDescriptor === 'string')
    return { name: pluginDescriptor, options: {} };
  if (typeof pluginDescriptor === 'object' && pluginDescriptor.length === 2)
    return { name: pluginDescriptor[0], options: pluginDescriptor[1] };
  throw new Error(`Invalid plugin format ${pluginDescriptor}`);
};

export default getRequestedPlugins;
export { getPluginDescriptor };
