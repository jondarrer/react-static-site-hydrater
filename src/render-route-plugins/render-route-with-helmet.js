import { HelmetProvider } from 'react-helmet-async';
import { parse } from 'node-html-parser';

import { appendChildTo, appendAttrsTo } from '../utils';

/**
 * Applies Helmet tags to the SSR rendered output
 */
const RenderRouteWithHelmet = {
  /**
   * Add helmetContext to the context
   *
   * @type {import('../models').PrepareCallback}
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
   * @type {import('../models').PostRenderCallback}
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

export default RenderRouteWithHelmet;
