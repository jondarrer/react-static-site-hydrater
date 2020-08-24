import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

/**
 * Applies Helmet tags to the SSR rendered output
 */
const RenderRouteWithApollo = {
  /**
   * Extracts the state of the GQL calls and provides them to the component
   *
   * @type {import('../models').PrepareCallback}
   */
  prepare: async (context, wrapComponent) => {
    wrapComponent({
      type: ApolloProvider,
      props: {
        client: context.apolloClient,
      },
    });
    const Component = context.component.type;
    const PreparedComponent = () => (
      <ApolloProvider client={context.apolloClient}>
        <Component />
      </ApolloProvider>
    );
    await getDataFromTree(PreparedComponent);
    context.component.props['state'] = context.apolloClient.extract();
  },
};

export default RenderRouteWithApollo;
