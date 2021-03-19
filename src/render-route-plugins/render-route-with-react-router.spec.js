/* global describe it expect */
const { StaticRouter } = require('react-router-dom');

const RenderRouteWithReactRouter = require('./render-route-with-react-router');

describe('RenderRouteWithReactRouter', () => {
  let hooks, wrapComponent;

  beforeEach(() => {
    hooks = {
      prepare: jest.fn(),
      postRender: jest.fn(),
    };
    wrapComponent = jest.fn();
  });

  describe('prepare', () => {
    it('should call wrapComponent with StaticRouter', () => {
      const context = {
        route: '/123',
      };
      RenderRouteWithReactRouter.prepare.apply(null, [context, wrapComponent]);
      expect(wrapComponent).toHaveBeenCalledWith({
        type: StaticRouter,
        props: {
          location: context.route,
          context: {},
        },
      });
    });
  });
});
