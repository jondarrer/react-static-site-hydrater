const { HelmetProvider } = require('react-helmet-async');
const { parse } = require('node-html-parser');

const { appendChildTo, appendAttrsTo } = require('../utils');

/**
 * Applies Helmet tags to the SSR rendered output
 * @type {require('../models').Plugin}
 */
const RenderRouteWithHelmet = {
  /**
   * Add helmetContext to the context
   *
   * @type {require('../models').PrepareCallback}
   */
  prepare: (context, wrapComponent) => {
    context.helmetContext = {};
    wrapComponent({
      type: HelmetProvider,
      props: {
        context: context.helmetContext,
      },
    });
  },

  /**
   * Adds the Helmet tags to the rendered component
   *
   * @type {require('../models').PostRenderCallback}
   */
  postRender: (context, _renderedComponent, indexHtml) => {
    const root = parse(indexHtml);

    const { helmet } = context.helmetContext;
    if (helmet !== undefined) {
      const head = root.querySelector('head');
      appendChildTo(head, helmet, 'title');
      appendChildTo(head, helmet, 'meta');
      appendChildTo(head, helmet, 'link');

      const html = root.querySelector('html');
      appendAttrsTo(html, helmet, 'html');

      const body = root.querySelector('body');
      appendAttrsTo(body, helmet, 'body');
    }

    return root.toString();
  },
};

module.exports = RenderRouteWithHelmet;
