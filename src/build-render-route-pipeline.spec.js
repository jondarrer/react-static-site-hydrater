/* global describe it expect */
import buildRenderRoutePipeline from './build-render-route-pipeline';

describe('buildRenderRoutePipeline', () => {
  const plugin1Render = {
    render: jest.fn(),
    finalise: jest.fn(),
  };
  const plugin2PrepareAndPostRender = {
    prepare: jest.fn(),
    postRender: jest.fn(),
  };
  const plugin3PrepareAndPostRender = {
    prepare: jest.fn(),
    postRender: jest.fn(),
  };
  const plugin4PrepareAndPreRender = {
    prepare: jest.fn(),
    preRender: jest.fn(),
  };

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
      {
        name: 'plugin-4-prepare-and-pre-render',
        plugin: plugin4PrepareAndPreRender,
      },
    ];
    const pipeline = buildRenderRoutePipeline(plugins);
    expect(pipeline).toHaveLength(8);
    expect(pipeline[0]).toStrictEqual({
      name: 'plugin-2-prepare-and-post-render',
      plugin: plugin2PrepareAndPostRender,
      hookName: 'prepare',
    });
    expect(pipeline[1]).toStrictEqual({
      name: 'plugin-3-prepare-and-post-render',
      plugin: plugin3PrepareAndPostRender,
      hookName: 'prepare',
    });
    expect(pipeline[2]).toStrictEqual({
      name: 'plugin-4-prepare-and-pre-render',
      plugin: plugin4PrepareAndPreRender,
      hookName: 'prepare',
    });
    expect(pipeline[3]).toStrictEqual({
      name: 'plugin-4-prepare-and-pre-render',
      plugin: plugin4PrepareAndPreRender,
      hookName: 'preRender',
    });
    expect(pipeline[4]).toStrictEqual({
      name: 'plugin-1-render',
      plugin: plugin1Render,
      hookName: 'render',
    });
    expect(pipeline[5]).toStrictEqual({
      name: 'plugin-3-prepare-and-post-render',
      plugin: plugin3PrepareAndPostRender,
      hookName: 'postRender',
    });
    expect(pipeline[6]).toStrictEqual({
      name: 'plugin-2-prepare-and-post-render',
      plugin: plugin2PrepareAndPostRender,
      hookName: 'postRender',
    });
    expect(pipeline[7]).toStrictEqual({
      name: 'plugin-1-render',
      plugin: plugin1Render,
      hookName: 'finalise',
    });
  });
});
