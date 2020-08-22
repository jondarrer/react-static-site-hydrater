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
 *
 * @typedef {Object} Hooks
 * @property {Array<PrepareCallback>} prepare The prepare hook, called before the
 * @property {Array<PostRenderCallback>} postRender The postRender hook, called after the React component has been rendered
 */
