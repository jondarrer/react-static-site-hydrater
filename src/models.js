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
 * @typedef {Object} Plugin
 * @property {String} name The prepare hook, called before rendering
 * @property {Plugin} plugin The postRender hook, called after the React component has been rendered
 */

/**
 * @typedef {Object} PipelinePluginHook
 * @property {String} name The prepare hook, called before rendering
 * @property {Plugin} plugin The postRender hook, called after the React component has been rendered
 * @property {String} hookName The postRender hook, called after the React component has been rendered
 */

/**
 * @typedef {Array<PipelinePluginHook>} Pipeline
 */
