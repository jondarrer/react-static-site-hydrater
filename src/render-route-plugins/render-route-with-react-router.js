import { StaticRouter } from 'react-router-dom';

/**
 * Applies Helmet tags to the SSR rendered output
 */
const RenderRouteWithReactRouter = {
  /**
   * Add helmetContext to the context
   *
   * @type {import('../models').PrepareCallback}
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
