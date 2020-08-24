/* global describe it expect */
import buildRenderRoutePipeline from './build-render-route-pipeline';

describe('buildRenderRoutePipeline', () => {
  let plugins;
  const plugin1Render = {
    render: jest.fn(),
  };
  const plugin2PrepareAndPostRender = {
    prepare: jest.fn(),
    postRender: jest.fn(),
  };
  const plugin3PrepareAndPostRender = {
    prepare: jest.fn(),
    postRender: jest.fn(),
  };
  const plugin4Prepare = {
    prepare: jest.fn(),
  };

  beforeEach(() => {
    plugins = [];
  });

  it('should return an empty execution pipeline when given no plugins', () => {
    const plugins = [];
    const pipeline = buildRenderRoutePipeline(plugins);
    expect(pipeline).toHaveLength(0);
  });

  it('should return the expected pipeline', () => {
    const plugins = [
      { name: 'plugin-1-render', plugin: plugin1Render },
      {
        name: 'plugin-2-prepare-and-post-render',
        plugin: plugin2PrepareAndPostRender,
      },
      {
        name: 'plugin-3-prepare-and-post-render',
        plugin: plugin3PrepareAndPostRender,
      },
      { name: 'plugin-4-prepare', plugin: plugin4Prepare },
    ];
    const pipeline = buildRenderRoutePipeline(plugins);
    expect(pipeline).toHaveLength(6);
    expect(pipeline).toStrictEqual([
      {
        name: 'plugin-2-prepare-and-post-render',
        plugin: plugin2PrepareAndPostRender,
        hookName: 'prepare',
      },
      {
        name: 'plugin-3-prepare-and-post-render',
        plugin: plugin3PrepareAndPostRender,
        hookName: 'prepare',
      },
      {
        name: 'plugin-4-prepare',
        plugin: plugin4Prepare,
        hookName: 'prepare',
      },
      {
        name: 'plugin-1-render',
        plugin: plugin1Render,
        hookName: 'render',
      },
      {
        name: 'plugin-3-prepare-and-post-render',
        plugin: plugin3PrepareAndPostRender,
        hookName: 'postRender',
      },
      {
        name: 'plugin-2-prepare-and-post-render',
        plugin: plugin2PrepareAndPostRender,
        hookName: 'postRender',
      },
    ]);
  });
});
