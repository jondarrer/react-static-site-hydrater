const { StaticRouter } = require('react-router-dom');

/**
 * Applies Helmet tags to the SSR rendered output
 * @type {require('../models').Plugin}
 */
const RenderRouteWithReactRouter = {
  /**
   * Add helmetContext to the context
   *
   * @type {require('../models').PrepareCallback}
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

module.exports = RenderRouteWithReactRouter;
