export const fake = 0;

/**
 * @callback WrapComponentCallback
 * @param {Any} element The component as a tree, see https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree
 */

/**
 * Called before rendering a route
 *
 * @callback PrepareCallback
 * @param {Any} context The context
 * @param {WrapComponentCallback} wrapComponent Wrap the component in another
 * @param {Object} options The options from the Webpack config
 */

/**
 * Called to render the React component for the route
 *
 * @callback RenderCallback
 * @param {Object} wrappedComponent The context
 * @return {String} The rendered wrapped component
 */

/**
 * Called after the React component has been rendered for a route and returns the index html
 *
 * @callback PostRenderCallback
 * @param {Any} context The context
 * @param {String} renderedComponent The rendered component
 * @param {String} indexHtml The index html
 * @return {String} The re-rendered index
 */

/**
 * Called after the React component has been rendered for a route
 *
 * @callback FinaliseCallback
 * @param {Any} context The context
 * @param {String} renderedComponent The rendered component
 * @param {String} indexHtml The index html
 * @return {String} The final rendered component
 */

/**
 * @typedef {Object} PluginWrapper
 * @property {String} name The name of the plugin, e.g. renderer
 * @property {Plugin} plugin The plugin itself
 * @property {Object} options The plugin options passed in from the Webpack config
 */

/**
 * @typedef {Object} Plugin
 * @property {PrepareCallback} [prepare] Called before rendering a route
 * @property {RenderCallback} [render] Called to render the React component for the route
 * @property {PostRenderCallback} [postRender] Called after the React component has been rendered for a route and returns the index html
 * @property {FinaliseCallback} [finalise] Called after the React component has been rendered for a route
 */

/**
 * @typedef {Array<{0: String, 1: Object}>} PluginDescriptor
 */

/**
 * @typedef {Object} PipelinePluginHook
 * @property {String} name The name of the plugin, e.g. renderer
 * @property {Plugin} plugin The plugin itself
 * @property {Object} options The plugin options passed in from the Webpack config
 * @property {String} hookName The name of the hook, e.g. prepare, render or postRender, etc.
 */

/**
 * @typedef {Array<PipelinePluginHook>} Pipeline
 */
