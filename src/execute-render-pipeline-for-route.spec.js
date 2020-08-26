/* global describe it expect */
import executeRenderPipelineForRoute from './execute-render-pipeline-for-route';

describe('executeRenderPipelineForRoute', () => {
  const p1Render = jest.fn();
  const p2Prepare = jest.fn();
  const p2PostRender = jest.fn();
  const p3Prepare = jest.fn();
  const p3PostRender = jest.fn();
  const p4Prepare = jest.fn();
  const p1Finalise = jest.fn();
  const plugin1Render = {
    render: p1Render,
    finalise: p1Finalise,
  };
  const plugin2PrepareAndPostRender = {
    prepare: p2Prepare,
    postRender: p2PostRender,
  };
  const plugin3PrepareAndPostRender = {
    prepare: p3Prepare,
    postRender: p3PostRender,
  };
  const plugin4Prepare = {
    prepare: p4Prepare,
  };
  const pipeline1 = [
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
    {
      name: 'plugin-1-render',
      plugin: plugin1Render,
      hookName: 'finalise',
    },
  ];

  beforeEach(() => {
    p1Render.mockReset();
    p1Finalise.mockReset();
    p2Prepare.mockReset();
    p2PostRender.mockReset();
    p3Prepare.mockReset();
    p3PostRender.mockReset();
    p4Prepare.mockReset();
  });

  it('should return nothing when given no pipeline', async () => {
    const pipeline = [];
    const result = await executeRenderPipelineForRoute(pipeline, '', '', null);
    expect(result).toBeNull();
  });

  it('should run the pipeline hooks', async () => {
    const route = '/abc-123';
    const indexHtml = '<html />';
    const Component = () => {};
    await executeRenderPipelineForRoute(pipeline1, route, indexHtml, Component);
    expect(p2Prepare).toHaveBeenCalledTimes(1);
    expect(p3Prepare).toHaveBeenCalledTimes(1);
    expect(p4Prepare).toHaveBeenCalledTimes(1);
    expect(p1Render).toHaveBeenCalledTimes(1);
    expect(p2PostRender).toHaveBeenCalledTimes(1);
    expect(p3PostRender).toHaveBeenCalledTimes(1);
    expect(p1Finalise).toHaveBeenCalledTimes(1);
  });

  it('should run the pipeline hooks with the correct params', async () => {
    const route = '/abc-123';
    const indexHtml = '<html />';
    const Component = () => {};
    const Wrapper1 = () => {};
    p1Render.mockReturnValue('Rendered Result');
    p4Prepare.mockImplementation((_context, wrapComponent) =>
      wrapComponent({
        type: Wrapper1,
        props: {},
      })
    );
    p2PostRender.mockReturnValue('<html />');
    p3PostRender.mockReturnValue('<html />');
    await executeRenderPipelineForRoute(pipeline1, route, indexHtml, Component);
    expect(p2Prepare.mock.calls[0][0]).toStrictEqual({
      route,
      component: {
        type: Component,
        props: {},
      },
      __wrappedComponent: {
        props: {
          children: [{ props: {}, type: Component }],
        },
        type: Wrapper1,
      },
    });
    expect(p3Prepare.mock.calls[0][0]).toStrictEqual({
      route,
      component: {
        type: Component,
        props: {},
      },
      __wrappedComponent: {
        props: {
          children: [{ props: {}, type: Component }],
        },
        type: Wrapper1,
      },
    });
    expect(p4Prepare.mock.calls[0][0]).toStrictEqual({
      route,
      component: {
        type: Component,
        props: {},
      },
      __wrappedComponent: {
        props: {
          children: [{ props: {}, type: Component }],
        },
        type: Wrapper1,
      },
    });
    expect(p1Render.mock.calls[0][0]).toStrictEqual({
      type: Wrapper1,
      props: {
        children: [
          {
            type: Component,
            props: {},
          },
        ],
      },
    });
    expect(p2PostRender.mock.calls[0][0]).toStrictEqual({
      route,
      component: {
        type: Component,
        props: {},
      },
      __wrappedComponent: {
        props: {
          children: [{ props: {}, type: Component }],
        },
        type: Wrapper1,
      },
    });
    expect(p2PostRender.mock.calls[0][1]).toStrictEqual('Rendered Result');
    expect(p2PostRender.mock.calls[0][2]).toStrictEqual(indexHtml);
    expect(p3PostRender.mock.calls[0][0]).toStrictEqual({
      route,
      component: {
        type: Component,
        props: {},
      },
      __wrappedComponent: {
        props: {
          children: [{ props: {}, type: Component }],
        },
        type: Wrapper1,
      },
    });
    expect(p3PostRender.mock.calls[0][1]).toStrictEqual('Rendered Result');
    expect(p3PostRender.mock.calls[0][2]).toStrictEqual(indexHtml);
    expect(p1Finalise.mock.calls[0][0]).toStrictEqual({
      route,
      component: {
        type: Component,
        props: {},
      },
      __wrappedComponent: {
        props: {
          children: [{ props: {}, type: Component }],
        },
        type: Wrapper1,
      },
    });
    expect(p1Finalise.mock.calls[0][1]).toStrictEqual('Rendered Result');
    expect(p1Finalise.mock.calls[0][2]).toStrictEqual(indexHtml);
  });

  it('should return the result of calling finalise', async () => {
    const route = '/abc-123';
    const indexHtml = '<html><body><div id="root"></div></body></html>';
    const Component = () => {};
    p1Render.mockReturnValue('Rendered Result');
    p2PostRender.mockReturnValue(indexHtml);
    p3PostRender.mockReturnValue(indexHtml);
    p4Prepare.mockResolvedValue();
    p1Finalise.mockImplementation((_ctx, renderedComponent, indexHtml) =>
      indexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedComponent}</div>`
      )
    );
    const result = await executeRenderPipelineForRoute(
      pipeline1,
      route,
      indexHtml,
      Component
    );
    expect(result).toBeDefined();
    expect(result).toBe(
      '<html><body><div id="root">Rendered Result</div></body></html>'
    );
  });
});
