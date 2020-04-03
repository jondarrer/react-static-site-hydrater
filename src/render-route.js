import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

const renderRoute = (route, indexHtml, Component) => {
  const renderedComponent = ReactDOMServer.renderToString(
    <StaticRouter location={route} context={{}}>
      <Component />
    </StaticRouter>
  );
  return indexHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedComponent}</div>`
  );
};

export default renderRoute;
