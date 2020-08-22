import { StaticRouter } from 'react-router-dom';

/**
 * @typedef {import('./models').Hooks} Hooks
 */

/**
 * Add helmetContext to the context
 *
 * @param {any} context
 */
const prepare = (context, wrapComponent) => {
  wrapComponent({
    type: StaticRouter,
    props: {
      location: context.route,
      context: {},
    },
  });
};

/**
 * Applies Helmet tags to the SSR rendered output
 *
 * @param {Hooks} hooks
 */
const renderRouteWithReactRouter = (hooks) => {
  hooks.prepare(prepare);
};

export default renderRouteWithReactRouter;
export { renderRouteWithReactRouter, prepare };
