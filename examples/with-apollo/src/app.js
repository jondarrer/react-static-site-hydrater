// NB. In a regular app, you will be able to reference react and react-router-dom
// in the regular way (here commented out). A work-around is in place here
// to ensure the same instance is used when building using the "outer"
// react-static-site-hydrater module in webpack.config.babel.js

// const React = require('react');
const React = require('../../../node_modules/react');
// const { Route, Switch } = require('react-router-dom');
const { Route, Switch } = require('../../../node_modules/react-router-dom');
// import { gql, useQuery } from '@apollo/client';
const { gql, useQuery } = require('../../../node_modules/@apollo/client');

const SAY_HELLO = gql`
  query SayHello($hello: String!) {
    sayHello(name: $name) @client
  }
`;

const Page = ({ title, name }) => {
  const { loading, error, data } = useQuery(SAY_HELLO, {
    variables: { name },
  });

  return (
    <>
      <h1>{title}</h1>
      <p>{data != null ? data.sayHello : ''}</p>
    </>
  );
};

const App = () => (
  <Switch>
    <Route path="/" exact>
      <Page title="index-content" name="World" />
    </Route>
    <Route path="/about">
      <h1>about-content</h1>
    </Route>
    <Route>
      <h1>not-found</h1>
    </Route>
  </Switch>
);

module.exports = App;
