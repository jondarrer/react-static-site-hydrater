/**
 * Build the execution pipeline for rendering a route
 *
 * @param {Array<require("./models").PluginWrapper>} plugins
 * @return {require("./models").Pipeline}
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

  // preRender
  pipeline.push(
    ...plugins
      .filter(({ plugin }) => Reflect.has(plugin, 'preRender'))
      .map((plugin) => {
        return {
          ...plugin,
          hookName: 'preRender',
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

module.exports = buildRenderRoutePipeline;
