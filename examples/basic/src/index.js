const React = require('react');
const { BrowserRouter } = require('react-router-dom');

const App = require('./app');

const BasicExample = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

module.exports = { BasicExample, App };
