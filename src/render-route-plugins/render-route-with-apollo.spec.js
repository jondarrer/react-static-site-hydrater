/* global describe it expect */
jest.mock('@apollo/client/react/ssr', () => {
  return {
    getDataFromTree: jest.fn(),
  };
});
const { ApolloProvider } = require('@apollo/client');
const { getDataFromTree } = require('@apollo/client/react/ssr');

const RenderRouteWithApollo = require('./render-route-with-apollo');

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
    it('should add the client to the context as apolloClient', async () => {
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
      expect(context).toHaveProperty('apolloClient');
      expect(context.apolloClient).toBe(options.client);
    });
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
  });

  describe('preRender', () => {
    it('should call getDataFromTree', async () => {
      const context = {
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      const wrappedComponent = {
        type: 'p',
        props: {
          children: 'Are you sure?',
        },
      };
      await RenderRouteWithApollo.preRender.apply(null, [
        context,
        wrappedComponent,
      ]);
      expect(getDataFromTree).toHaveBeenCalled();
    });
  });

  describe('postRender', () => {
    it('should return with the __APOLLO_STATE__ set in the indexHtml', () => {
      const context = {
        apolloClient: options.client,
        component: {
          type: jest.fn(),
          props: {},
        },
      };
      const indexHtml = '<div id="root"></div>';
      const renderedComponent = '';
      options.client.extract.mockReturnValue({ a: 1 });
      const result = Reflect.apply(RenderRouteWithApollo['postRender'], null, [
        context,
        renderedComponent,
        indexHtml,
      ]);
      expect(result).toBe(
        '<script>window.__APOLLO_STATE__={"a":1};</script><div id="root"></div>'
      );
    });
  });
});
