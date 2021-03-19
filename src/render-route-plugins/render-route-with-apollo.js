const { ApolloProvider } = require('@apollo/client');
const { getDataFromTree } = require('@apollo/client/react/ssr');
const { jsxify } = require('../utils');

/**
 * Applies Helmet tags to the SSR rendered output
 * @type {require('../models').Plugin}
 */
const RenderRouteWithApollo = {
  /**
   * Wrap the component with ApolloProvider
   *
   * @type {require('../models').PrepareCallback}
   */
  prepare: (context, wrapComponent, { client }) => {
    context.apolloClient = client;
    wrapComponent({
      type: ApolloProvider,
      props: {
        client,
      },
    });
  },

  /**
   * Pre-fetches the GQL calls and provides them to client.extract
   *
   * @type {require('../models').PreRenderCallback}
   */
  preRender: async (_context, wrappedComponent) => {
    await getDataFromTree(jsxify(wrappedComponent));
  },

  /**
   * Adds the Apollo  tags to the index html
   * https://www.apollographql.com/docs/react/performance/server-side-rendering/#using-getdatafromtree
   *
   * @type {require('../models').PostRenderCallback}
   */
  postRender: (context, _renderedComponent, indexHtml) => {
    const state = context.apolloClient.extract();
    return indexHtml.replace(
      '<div id="root"></div>',
      `<script>window.__APOLLO_STATE__=${JSON.stringify(state).replace(
        /</g,
        '\\u003c'
      )};</script><div id="root"></div>`
    );
  },
};

module.exports = RenderRouteWithApollo;
