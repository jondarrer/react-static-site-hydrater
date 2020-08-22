import { HelmetProvider } from 'react-helmet-async';
import { parse } from 'node-html-parser';

import { appendChildTo, appendAttrsTo } from './utils';

/**
 * @typedef {import('./models').Hooks} Hooks
 */

/**
 * Add helmetContext to the context
 *
 * @param {any} context
 */
const prepare = (context, wrapComponent) => {
  context.helmetContext = {};
  wrapComponent({
    type: HelmetProvider,
    props: {
      context: context.helmetContext,
    },
  });
};

/**
 * Adds the Helmet tags to the rendered component
 *
 * @param {any} context
 */
const postRender = (context, renderedComponent, indexHtml) => {
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
};

/**
 * Applies Helmet tags to the SSR rendered output
 *
 * @param {Hooks} hooks
 */
const renderRouteWithHelmet = (hooks) => {
  hooks.prepare.push(prepare);
  hooks.postRender.push(postRender);
};

export default renderRouteWithHelmet;
export { renderRouteWithHelmet, prepare, postRender };
