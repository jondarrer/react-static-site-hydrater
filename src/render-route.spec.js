/* global describe it expect */
const ReactDOMServer = require('react-dom/server');
const renderRoute = require('./render-route');

jest.mock('react-dom/server');

describe('renderRoute', () => {
  it('should render the route by calling ReactDOMServer.renderToString', () => {
    const renderedContent = 'the-content';
    ReactDOMServer.renderToString.mockResolvedValue(renderedContent);
    result = renderRoute(route, indexHtml);
    expect(ReactDOMServer.renderToString).toBeCalled();
  });
});
