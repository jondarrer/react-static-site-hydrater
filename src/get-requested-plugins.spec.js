/* global describe it expect */
import RenderRouteRenderer from './render-route-plugins/render-route-renderer';
import RenderRouteWithReactRouter from './render-route-plugins/render-route-with-react-router';
import RenderRouteWithHelmet from './render-route-plugins/render-route-with-helmet';
import RenderRouteWithApollo from './render-route-plugins/render-route-with-apollo';

import getRequestedPlugins, {
  getPluginDescriptor,
} from './get-requested-plugins';

describe('getRequestedPlugins', () => {
  it('should get the basic render-route-renderer plugin when no others are requested', () => {
    const plugins = getRequestedPlugins();
    expect(plugins).toStrictEqual([
      { name: 'renderer', plugin: RenderRouteRenderer, options: {} },
    ]);
  });
  it('should get the basic render-route-renderer plugin when no others are requested', () => {
    const plugins = getRequestedPlugins(['react-router', 'helmet', 'apollo']);
    expect(plugins).toStrictEqual([
      { name: 'renderer', plugin: RenderRouteRenderer, options: {} },
      { name: 'react-router', plugin: RenderRouteWithReactRouter, options: {} },
      { name: 'helmet', plugin: RenderRouteWithHelmet, options: {} },
      { name: 'apollo', plugin: RenderRouteWithApollo, options: {} },
    ]);
  });
});

describe('getPluginDescriptor', () => {
  it('should get the name and empty options from a string descriptor', () => {
    const pluginDescriptor = getPluginDescriptor('plugin-1');
    expect(pluginDescriptor).toStrictEqual({
      name: 'plugin-1',
      options: {},
    });
  });
  it('should get the name and passed in options from a proper PluginDescriptor', () => {
    const plugins = getPluginDescriptor([
      'plugin-1',
      { option1: 'one', option2: 'two' },
    ]);
    expect(plugins).toStrictEqual({
      name: 'plugin-1',
      options: { option1: 'one', option2: 'two' },
    });
  });
});
