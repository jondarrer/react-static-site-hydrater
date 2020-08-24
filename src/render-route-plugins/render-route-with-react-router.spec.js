/* global describe it expect */
import { StaticRouter } from 'react-router-dom';

import RenderRouteWithReactRouter from './render-route-with-react-router';

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
