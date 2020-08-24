/**
 * Build the execution pipeline for rendering a route
 */
const buildRenderRoutePipeline = (plugins) => {
  const pipeline = [];
  if (!plugins || plugins.length < 1) {
    return [];
  }

  // prepare
  pipeline.push(
    ...plugins
      .filter(({ plugin }) => Reflect.has(plugin, 'prepare'))
      .map((plugin) => {
        return {
          ...plugin,
          hookName: 'prepare',
        };
      })
  );

  // render
  pipeline.push(
    ...plugins
      .filter(({ plugin }) => Reflect.has(plugin, 'render'))
      .map((plugin) => {
        return {
          ...plugin,
          hookName: 'render',
        };
      })
  );

  // postRender
  pipeline.push(
    ...[...plugins]
      .reverse()
      .filter(({ plugin }) => Reflect.has(plugin, 'postRender'))
      .map((plugin) => {
        return {
          ...plugin,
          hookName: 'postRender',
        };
      })
  );

  return pipeline;
};

export default buildRenderRoutePipeline;
