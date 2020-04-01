/* global describe it expect */
const React = require('react');
const { Route, Switch } = require('react-router-dom');

const renderRoute = require('./render-route');

describe('renderRoute', () => {
  const indexHtml = '<html><body><div id="root"></div></body></html>';
  const component = (
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
    result = renderRoute(route, indexHtml, component);
    expect(result).toBe(
      `<html><body><div id="root">${renderedContent}</div></body></html>`
    );
  });

  it('should render the about route for /about', () => {
    const route = '/about';
    const renderedContent = '<h1>about-content</h1>';
    result = renderRoute(route, indexHtml, component);
    expect(result).toBe(
      `<html><body><div id="root">${renderedContent}</div></body></html>`
    );
  });

  it('should render the not-found route for /unknown', () => {
    const route = '/unknown';
    const renderedContent = '<h1>not-found</h1>';
    result = renderRoute(route, indexHtml, component);
    expect(result).toBe(
      `<html><body><div id="root">${renderedContent}</div></body></html>`
    );
  });
});
