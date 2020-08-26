import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

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
    wrapComponent({
      type: ApolloProvider,
      props: {
        client,
      },
    });
    const Component = context.component.type;
    const PreparedComponent = () => (
      <ApolloProvider client={client}>
        <Component />
      </ApolloProvider>
    );
    await getDataFromTree(PreparedComponent);
    context.component.props['state'] = client.extract();
  },
};

export default RenderRouteWithApollo;
