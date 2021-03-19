/* global describe it expect */
const RenderRouteRenderer = require('./render-route-plugins/render-route-renderer');
const RenderRouteWithReactRouter = require('./render-route-plugins/render-route-with-react-router');
const RenderRouteWithHelmet = require('./render-route-plugins/render-route-with-helmet');
const RenderRouteWithApollo = require('./render-route-plugins/render-route-with-apollo');

const {
  getRequestedPlugins,
  getPluginDescriptor,
} = require('./get-requested-plugins');

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
