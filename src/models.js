export const fake = 0;

/**
 * @callback WrapComponentCallback
 * @param {Any} element The component as a tree, see https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree
 */

/**
 * @callback PrepareCallback
 * @param {Any} context The context
 * @param {WrapComponentCallback} wrapComponent Wrap the component in another
 */

/**
 * @callback PostRenderCallback
 * @param {Any} context The context
 * @param {String} renderedComponent The rendered component
 * @return {String} The re-rendered component
 */

/**
 * @callback PrepareHook
 * @param {PrepareCallback} prepareCallback The prepare hook callback
 */

/**
 * @callback PostRenderHook
 * @param {PostRenderCallback} postRenderCallback The postRender hook callback
 */

/**
 * @typedef {Object} Hooks
 * @property {PrepareHook} prepare The prepare hook, called before rendering
 * @property {PostRenderHook} postRender The postRender hook, called after the React component has been rendered
 */

/**
 * @callback Plugin
 * @param {Hooks} hooks The hooks to which the plugin can attach
 */

/**
 * @typedef {Object} PluginWithName
 * @property {String} name The name of the plugin
 * @property {Plugin} plugin The plugin
 */
