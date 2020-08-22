import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

/**
 * @typedef {import('./models').Hooks} Hooks
 */

/**
 * Extracts the state of the GQL calls and provides them to the component
 *
 * @param {any} context
 */
const prepare = async (context, wrapComponent) => {
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
};

/**
 * Applies Helmet tags to the SSR rendered output
 *
 * @param {Hooks} hooks
 */
const renderRouteWithApollo = (hooks) => {
  hooks.prepare(prepare);
};

export default renderRouteWithApollo;
export { renderRouteWithApollo, prepare };
