/**
 * Orchestrates the plugins into a render pipeline.
 *
 * @param {Array<import("./models").PluginWithName>} plugins The plugins to build into a pipeline
 * @return {Array<Any>} The pipeline
 */
const buildRenderPipeline = (plugins) => {
  const renderPipeline = [];
  // For each plugin
  // prepare
  //  - Provide a context and wrapComponent
  //
  // For each plugin
  // render
  //  - Provide a wrappedComponent (which produces renderedComponent)
  //
  // For each plugin
  // postRender
  //  - Provide a plugin, context, renderedComponent and indexHtml
  return renderPipeline;
};

export default buildRenderPipeline;
