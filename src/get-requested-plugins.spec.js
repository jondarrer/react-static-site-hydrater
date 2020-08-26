/* global describe it expect */
import {
  RenderRouteRenderer,
  RenderRouteWithReactRouter,
  RenderRouteWithHelmet,
  RenderRouteWithApollo,
} from './render-route-plugins';

import getRequestedPlugins, {
  getPluginDescriptor,
} from './get-requested-plugins';

describe('getRequestedPlugins', () => {
  it('should get the basic render-route-renderer plugin when no others are requested', () => {
    const pluigins = getRequestedPlugins();
    expect(pluigins).toStrictEqual([
      { name: 'renderer', plugin: RenderRouteRenderer, options: {} },
    ]);
  });
  it('should get the basic render-route-renderer plugin when no others are requested', () => {
    const pluigins = getRequestedPlugins(['react-router', 'helmet', 'apollo']);
    expect(pluigins).toStrictEqual([
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
    const pluigins = getPluginDescriptor([
      'plugin-1',
      { option1: 'one', option2: 'two' },
    ]);
    expect(pluigins).toStrictEqual({
      name: 'plugin-1',
      options: { option1: 'one', option2: 'two' },
    });
  });
});
