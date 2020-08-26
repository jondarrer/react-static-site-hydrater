/**
 * Build the execution pipeline for rendering a route
 *
 * @param {Array<import("./models").PluginWrapper>} plugins
 * @return {import("./models").Pipeline}
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

  // finalise
  pipeline.push(
    ...plugins
      .filter(({ plugin }) => Reflect.has(plugin, 'finalise'))
      .map((plugin) => {
        return {
          ...plugin,
          hookName: 'finalise',
        };
      })
  );

  return pipeline;
};

export default buildRenderRoutePipeline;
