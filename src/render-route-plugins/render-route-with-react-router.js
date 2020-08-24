import { StaticRouter } from 'react-router-dom';

/**
 * Applies Helmet tags to the SSR rendered output
 */
const RenderRouteWithReactRouter = {
  /**
   * Add helmetContext to the context
   *
   * @param {any} context
   * @param {Function} wrapComponent
   */
  prepare: (context, wrapComponent) => {
    wrapComponent({
      type: StaticRouter,
      props: {
        location: context.route,
        context: {},
      },
    });
  },
};

export default RenderRouteWithReactRouter;
