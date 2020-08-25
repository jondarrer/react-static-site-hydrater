/**
 * @param {Array<String>} pluginNames
 * @return {import("./models").Plugin} The list of requested plugins
 */
const getRequestedPlugins = (pluginNames) => {
  if (!pluginNames) pluginNames = [];

  pluginNames.unshift('renderer');

  return pluginNames.map((name) => {
    switch (name) {
      case 'renderer':
        const { RenderRouteRenderer } = require('./render-route-plugins');
        return { name, plugin: RenderRouteRenderer };
      case 'react-router':
        const {
          RenderRouteWithReactRouter,
        } = require('./render-route-plugins');
        return { name, plugin: RenderRouteWithReactRouter };
      case 'helmet':
        const { RenderRouteWithHelmet } = require('./render-route-plugins');
        return { name, plugin: RenderRouteWithHelmet };
      case 'apollo':
        const { RenderRouteWithApollo } = require('./render-route-plugins');
        return { name, plugin: RenderRouteWithApollo };
    }
  });
};

export default getRequestedPlugins;
