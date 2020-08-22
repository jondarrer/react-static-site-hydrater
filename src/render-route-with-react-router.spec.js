/* global describe it expect */
import { StaticRouter } from 'react-router-dom';

import renderRouteWithReactRouter, {
  prepare,
} from './render-route-with-react-router';

describe('renderRouteWithReactRouter', () => {
  let hooks, wrapComponent;

  beforeEach(() => {
    hooks = {
      prepare: jest.fn(),
      postRender: jest.fn(),
    };
    wrapComponent = jest.fn();
  });

  describe('prepare', () => {
    it('should add a prepare hook', () => {
      renderRouteWithReactRouter(hooks);
      expect(hooks.prepare).toHaveBeenCalledWith(prepare);
    });

    it('should call wrapComponent with StaticRouter', () => {
      const context = {
        route: '/123',
      };
      prepare.apply(null, [context, wrapComponent]);
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
