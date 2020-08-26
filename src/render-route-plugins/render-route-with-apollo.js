import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { StaticRouter } from 'react-router-dom';

/**
 * Applies Helmet tags to the SSR rendered output
 * @type {import('../models').Plugin}
 */
const RenderRouteWithApollo = {
  /**
   * Extracts the state of the GQL calls and provides them to the component
   *
   * @type {import('../models').PrepareCallback}
   */
  prepare: async (context, wrapComponent, { client }) => {
    context.apolloClient = client;
    wrapComponent({
      type: ApolloProvider,
      props: {
        client,
      },
    });
    const Component = context.component.type;
    const PreparedComponent = (
      <ApolloProvider client={client}>
        <StaticRouter location={context.route}>
          <Component />
        </StaticRouter>
      </ApolloProvider>
    );
    await getDataFromTree(PreparedComponent);
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
