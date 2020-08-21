const React = require('react');
const ReactDOM = require('react-dom');
const { BrowserRouter } = require('react-router-dom');
const { HelmetProvider } = require('react-helmet-async');

const App = require('./app');

const BasicExample = () => (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

ReactDOM.hydrate(BasicExample, document.getElementById('root'));

module.exports = App;
