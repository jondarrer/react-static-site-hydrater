/**
 * @typedef {import('./models').Hooks} Hooks
 */

/**
 * Renders the route using the provided plugins
 * @param {String} route
 * @param {String} indexHtml
 * @param {React.Component} Component
 * @param {Array<Any>} plugins
 */
const renderRoutePlugins = (route, indexHtml, Component, plugins) => {
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
};

const renderRoutePluginsPrepare = (plugins, context, wrapComponent) => {};

const renderRoutePluginsRender = (plugins, wrappedComponent) => {};

const renderRoutePluginsPostRender = (
  plugins,
  context,
  renderedComponent,
  indexHtml
) => {};

export default renderRoutePlugins;
