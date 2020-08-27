/* global describe it expect */
jest.mock('./execute-render-pipeline-for-route');
import renderAllRoutesWithPlugins from './render-all-routes-with-plugins';
import executeRenderPipelineForRoute from './execute-render-pipeline-for-route';
import { RenderRouteRenderer } from './render-route-plugins';

describe('renderAllRoutesWithPlugins', () => {
  const indexHtml = '<html><body><div id="root"></div></body></html>';
  const component = () => 'The component';

  beforeEach(() => {
    executeRenderPipelineForRoute.mockClear();
  });

  it('should be called for each route / and /about', () => {
    const routes = ['/', '/about'];
    executeRenderPipelineForRoute.mockImplementation(() => 'abc');
    const result = renderAllRoutesWithPlugins(routes, indexHtml, component, []);
    expect(executeRenderPipelineForRoute).toBeCalledTimes(2);
  });

  it('should render the specified routes / and /about', async () => {
    const routes = ['/', '/about'];
    executeRenderPipelineForRoute.mockImplementation(() => 'abc');
    const result = await renderAllRoutesWithPlugins(
      routes,
      indexHtml,
      component,
      []
    );
    expect(executeRenderPipelineForRoute.mock.calls[0]).toEqual([
      [
        {
          hookName: 'render',
          name: 'renderer',
          options: {},
          plugin: RenderRouteRenderer,
        },
        {
          hookName: 'finalise',
          name: 'renderer',
          options: {},
          plugin: RenderRouteRenderer,
        },
      ],
      routes[0],
      indexHtml,
      component,
    ]);
    expect(executeRenderPipelineForRoute.mock.calls[1]).toEqual([
      [
        {
          hookName: 'render',
          name: 'renderer',
          options: {},
          plugin: RenderRouteRenderer,
        },
        {
          hookName: 'finalise',
          name: 'renderer',
          options: {},
          plugin: RenderRouteRenderer,
        },
      ],
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
