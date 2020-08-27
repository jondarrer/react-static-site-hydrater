import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { jsxify } from '../utils';

/**
 * Applies Helmet tags to the SSR rendered output
 * @type {import('../models').Plugin}
 */
const RenderRouteWithApollo = {
  /**
   * Wrap the component with ApolloProvider
   *
   * @type {import('../models').PrepareCallback}
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
   * @type {import('../models').PreRenderCallback}
   */
  preRender: async (_context, wrappedComponent) => {
    await getDataFromTree(jsxify(wrappedComponent));
  },

  /**
   * Adds the Apollo  tags to the index html
   * https://www.apollographql.com/docs/react/performance/server-side-rendering/#using-getdatafromtree
   *
   * @type {import('../models').PostRenderCallback}
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

export default RenderRouteWithApollo;
export { RenderRouteWithApollo };
