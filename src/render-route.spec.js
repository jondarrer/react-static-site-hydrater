/* global describe it expect */
const React = require('react');
const { Route, Switch } = require('react-router-dom');
const fs = require('fs');
const { resolve } = require('path');

const renderRoute = require('./render-route');

describe('renderRoute', () => {
  const indexHtml = fs.readFileSync(resolve(__dirname, './index.ejs'), {
    encoding: 'utf8',
  });
  const Component = () => (
    <Switch>
      <Route path="/" exact>
        <h1>index-content</h1>
      </Route>
      <Route path="/about">
        <h1>about-content</h1>
      </Route>
      <Route>
        <h1>not-found</h1>
      </Route>
    </Switch>
  );

  it('should render the index route for /', () => {
    const route = '/';
    const renderedContent = '<h1>index-content</h1>';
    result = renderRoute(route, indexHtml, Component);
    expect(result).toEqual(
      indexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedContent}</div>`
      )
    );
  });

  it('should render the about route for /about', () => {
    const route = '/about';
    const renderedContent = '<h1>about-content</h1>';
    result = renderRoute(route, indexHtml, Component);
    expect(result).toEqual(
      indexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedContent}</div>`
      )
    );
  });

  it('should render the not-found route for /unknown', () => {
    const route = '/unknown';
    const renderedContent = '<h1>not-found</h1>';
    result = renderRoute(route, indexHtml, Component);
    expect(result).toEqual(
      indexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedContent}</div>`
      )
    );
  });
});
