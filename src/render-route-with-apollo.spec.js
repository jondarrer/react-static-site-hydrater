/* global describe it expect */
jest.mock('@apollo/client/react/ssr', () => {
  return {
    getDataFromTree: jest.fn(),
  };
});
import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

import renderRouteWithApollo, { prepare } from './render-route-with-apollo';

describe('renderRouteWithApollo', () => {
  let hooks, wrapComponent;

  beforeEach(() => {
    hooks = {
      prepare: jest.fn(),
      postRender: jest.fn(),
    };
    wrapComponent = jest.fn();
    getDataFromTree.mockReset();
  });

  describe('prepare', () => {
    it('should add a prepare hook', () => {
      renderRouteWithApollo(hooks);
      expect(hooks.prepare).toHaveBeenCalledWith(prepare);
    });

    it('should call wrapComponent with ApolloProvider', () => {
      const context = {
        apolloClient: {
          extract: jest.fn(),
        },
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      prepare.apply(null, [context, wrapComponent]);
      expect(wrapComponent).toHaveBeenCalledWith({
        type: ApolloProvider,
        props: {
          client: context.apolloClient,
        },
      });
    });

    it('should call getDataFromTree', async () => {
      const context = {
        apolloClient: {
          extract: jest.fn(),
        },
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      await prepare.apply(null, [context, wrapComponent]);
      expect(getDataFromTree).toHaveBeenCalled();
    });

    it('should add a state prop to the component with the extracted client state', async () => {
      const context = {
        apolloClient: {
          extract: jest.fn(),
        },
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      context.apolloClient.extract.mockReturnValue('EXTRACTED_STATE');
      await prepare.apply(null, [context, wrapComponent]);
      expect(context.component.props).toHaveProperty('state');
      expect(context.component.props.state).toBe('EXTRACTED_STATE');
    });
  });
});
