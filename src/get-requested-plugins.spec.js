/* global describe it expect */
import {
  RenderRouteRenderer,
  RenderRouteWithReactRouter,
  RenderRouteWithHelmet,
  RenderRouteWithApollo,
} from './render-route-plugins';

import getRequestedPlugins from './get-requested-plugins';

describe('getRequestedPlugins', () => {
  it('should get the basic render-route-renderer plugin when no others are requested', () => {
    const pluigins = getRequestedPlugins();
    expect(pluigins).toStrictEqual([
      { name: 'renderer', plugin: RenderRouteRenderer },
    ]);
  });
  it('should get the basic render-route-renderer plugin when no others are requested', () => {
    const pluigins = getRequestedPlugins(['react-router', 'helmet', 'apollo']);
    expect(pluigins).toStrictEqual([
      { name: 'renderer', plugin: RenderRouteRenderer },
      { name: 'react-router', plugin: RenderRouteWithReactRouter },
      { name: 'helmet', plugin: RenderRouteWithHelmet },
      { name: 'apollo', plugin: RenderRouteWithApollo },
    ]);
  });
});
