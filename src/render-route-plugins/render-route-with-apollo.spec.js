/* global describe it expect */
jest.mock('@apollo/client/react/ssr', () => {
  return {
    getDataFromTree: jest.fn(),
  };
});
import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

import RenderRouteWithApollo from './render-route-with-apollo';

describe('RenderRouteWithApollo', () => {
  let wrapComponent;
  const options = {
    client: {
      extract: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapComponent = jest.fn();
    getDataFromTree.mockReset();
    options.client.extract.mockReset();
  });

  describe('prepare', () => {
    it('should call wrapComponent with ApolloProvider', () => {
      const context = {
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      RenderRouteWithApollo.prepare.apply(null, [
        context,
        wrapComponent,
        options,
      ]);
      expect(wrapComponent).toHaveBeenCalledWith({
        type: ApolloProvider,
        props: {
          client: options.client,
        },
      });
    });

    it('should call getDataFromTree', async () => {
      const context = {
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      await RenderRouteWithApollo.prepare.apply(null, [
        context,
        wrapComponent,
        options,
      ]);
      expect(getDataFromTree).toHaveBeenCalled();
    });

    it('should add a state prop to the component with the extracted client state', async () => {
      const context = {
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      options.client.extract.mockReturnValue('EXTRACTED_STATE');
      await RenderRouteWithApollo.prepare.apply(null, [
        context,
        wrapComponent,
        options,
      ]);
      expect(context.component.props).toHaveProperty('state');
      expect(context.component.props.state).toBe('EXTRACTED_STATE');
    });
  });
});
