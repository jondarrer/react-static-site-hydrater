/* global describe it expect */
import renderRoutePlugins from './render-route-plugins';

describe('renderRoutePlugins', () => {
  const Component = jest.fn();
  let route, indexHtml, plugins;

  beforeEach(() => {
    route = '/abc-123';
    indexHtml = fs.readFileSync(
      resolve(__dirname, './test-assets/index.html'),
      {
        encoding: 'utf8',
      }
    );
    Component.mockReset();
  });

  it('should add a prepare hook', () => {
    renderRoutePlugins(route, indexHtml, Component, plugins);
    expect(hooks.prepare).toHaveBeenCalledWith(prepare);
  });

  it('should call wrapComponent with StaticRouter', () => {
    const context = {
      route: '/123',
    };
    prepare.apply(null, [context, wrapComponent]);
    expect(wrapComponent).toHaveBeenCalledWith({
      type: StaticRouter,
      props: {
        location: context.route,
        context: {},
      },
    });
  });
});
