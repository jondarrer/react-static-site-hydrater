/* global describe it expect */
import React from 'react';
import renderAllRoutes from './render-all-routes';
import renderRoute from './render-route';

jest.mock('./render-route');

describe('renderAllRoutes', () => {
  const indexHtml = '<html><body><div id="root"></div></body></html>';
  const component = React.createElement('div');

  beforeEach(() => {
    renderRoute.mockClear();
  });

  it('should render the specified routes / and /about', () => {
    const routes = ['/', '/about'];
    renderRoute.mockImplementation(() => 'abc');
    const result = renderAllRoutes(routes, indexHtml, component);
    expect(renderRoute).toBeCalledTimes(2);
    expect(renderRoute.mock.calls[0]).toEqual([
      routes[0],
      indexHtml,
      component,
    ]);
    expect(renderRoute.mock.calls[1]).toEqual([
      routes[1],
      indexHtml,
      component,
    ]);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ route: '/', renderedAs: 'abc' });
    expect(result[1]).toEqual({ route: '/about', renderedAs: 'abc' });
  });
});
