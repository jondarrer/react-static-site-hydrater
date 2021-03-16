import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { parse } from 'node-html-parser';

import { appendChildTo, appendAttrsTo } from './utils';

const renderRoute = (route, indexHtml, Component) => {
  const helmetContext = {};
  const renderedComponent = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={route} context={{}}>
        <Component />
      </StaticRouter>
    </HelmetProvider>
  );
  const root = parse(indexHtml);
  const { helmet } = helmetContext;
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
  return (
    root
      .toString()
      .replace(
        '<div id="root"></div>',
        `<div id="root">${renderedComponent}</div>`
      )
  );
};

export default renderRoute;
