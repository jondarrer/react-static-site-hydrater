/* global describe it expect */
import buildRenderPipeline from './build-render-pipeline';

describe('buildRenderPipeline', () => {
  let plugins;
  const routeRendererPlugin = { render: jest.fn() };
  const pluginWithPrepare = { prepare: jest.fn() };
  const pluginWithPrepareAndPostRender = {
    prepare: jest.fn(),
    postRender: jest.fn(),
  };

  beforeEach(() => {});

  it('should return an empty pipeline when no plugins are provided', () => {
    plugins = [];
    const renderPipeline = buildRenderPipeline(plugins);
    expect(renderPipeline).toBeDefined();
    expect(Array.isArray(renderPipeline)).toBeTruthy();
    expect(renderPipeline).toHaveLength(0);
  });

  it('should add a prepare hook', () => {
    plugins = [
      { name: 'route-renderer', plugin: routeRendererPlugin },
      { name: 'plugin-with-prepare', plugin: pluginWithPrepare },
      {
        name: 'plugin-with-prepare-and-post-render',
        plugin: pluginWithPrepareAndPostRender,
      },
    ];
    const renderPipeline = buildRenderPipeline(plugins);
    expect(renderPipeline).toBeDefined();
    expect(renderPipeline).toStrictEqual([
      {
        fn: pluginWithPrepare.prepare,
        fnType: 'prepare',
        pluginName: 'plugin-with-prepare',
        fn: pluginWithPrepareAndPostRender.prepare,
        fnType: 'prepare',
        pluginName: 'plugin-with-prepare-and-post-render',
        fn: routeRendererPlugin.render,
        fnType: 'render',
        pluginName: 'route-renderer',
        fn: routeRendererPlugin.postRender,
        fnType: 'postRender',
        pluginName: 'plugin-with-prepare-and-post-render',
      },
    ]);
  });
});
