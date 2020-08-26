const React = require('react');
const ReactDOM = require('react-dom');
const { BrowserRouter } = require('react-router-dom');
const { HelmetProvider } = require('react-helmet-async');
const { ApolloProvider } = require('@apollo/client');

const App = require('./app');
const client = require('./client');

const BasicExample = () => (
  <HelmetProvider>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </HelmetProvider>
);

ReactDOM.hydrate(BasicExample, document.getElementById('root'));
