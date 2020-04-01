const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');

const renderRoute = (route, indexHtml, component) => {
  const renderedComponent = ReactDOMServer.renderToString(
    <StaticRouter location={route} context={{}}>
      {component}
    </StaticRouter>
  );
  return indexHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedComponent}</div>`
  );
};

module.exports = renderRoute;
