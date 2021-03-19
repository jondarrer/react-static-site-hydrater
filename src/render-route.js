const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { HelmetProvider } = require('react-helmet-async');
const { parse } = require('node-html-parser');

const { appendChildTo, appendAttrsTo } = require('./utils');

const renderRoute = (route, indexHtml, Component) => {
  const helmetContext = {};
  const renderedComponent = ReactDOMServer.renderToString(
    React.createElement(
      HelmetProvider,
      {
        context: helmetContext,
      },
      React.createElement(
        StaticRouter,
        {
          location: route,
          context: {},
        },
        React.createElement(Component)
      )
    )
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
  return root
    .toString()
    .replace(
      '<div id="root"></div>',
      `<div id="root">${renderedComponent}</div>`
    );
};

module.exports = renderRoute;
