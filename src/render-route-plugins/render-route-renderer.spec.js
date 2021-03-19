/* global describe it expect */
jest.mock('react-dom/server', () => {
  return {
    renderToString: jest.fn(),
  };
});
const { renderToString } = require('react-dom/server');

const RenderRouteRenderer = require('./render-route-renderer');

describe('RenderRouteRenderer', () => {
  describe('render', () => {
    it('should call render on the wrappedComponent', () => {
      const wrappedComponent = {
        type: 'div',
        props: {
          children: [
            {
              type: 'p',
              props: {
                children: 'Are you sure?',
              },
            },
            {
              type: 'button',
              props: {
                children: 'Yep',
              },
            },
            {
              type: 'button',
              props: {
                color: 'blue',
                children: 'Cancel',
              },
            },
          ],
        },
      };
      renderToString.mockReset();
      renderToString.mockReturnValue('rendered');
      const renderedComponent = Reflect.apply(
        RenderRouteRenderer['render'],
        null,
        [wrappedComponent]
      );
      expect(renderToString).toHaveBeenCalled();
      expect(renderedComponent).toBe('rendered');
    });
  });
  describe('finalise', () => {
    it('should call finalise on the indexHtml and renderedComponent', () => {
      const indexHtml = '<html><body><div id="root"></div></body></html>';
      const renderedComponent = '<div>Hello, Webpack!</div>';
      const finalHtml = Reflect.apply(RenderRouteRenderer['finalise'], null, [
        {},
        renderedComponent,
        indexHtml,
      ]);
      expect(finalHtml).toBe(
        '<!DOCTYPE html>\n<html><body><div id="root"><div>Hello, Webpack!</div></div></body></html>'
      );
    });
  });
});
