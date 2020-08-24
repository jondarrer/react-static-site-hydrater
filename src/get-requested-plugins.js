import {
  RenderRouteWithReactRouter,
  RenderRouteWithHelmet,
  RenderRouteWithApollo,
  RenderRouteRenderer,
} from './render-route-plugins';

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
        return { name, plugin: RenderRouteRenderer };
      case 'react-router':
        return { name, plugin: RenderRouteWithReactRouter };
      case 'helmet':
        return { name, plugin: RenderRouteWithHelmet };
      case 'apollo':
        return { name, plugin: RenderRouteWithApollo };
    }
  });
};

export default getRequestedPlugins;
