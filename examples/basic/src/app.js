// NB. In a regular app, you will be able to reference react and react-router-dom
// in the regular way (here commented out). A work-around is in place here
// to ensure the same instance is used when building using the "outer"
// react-static-site-hydrater module in webpack.config.babel.js

// const React = require('react');
const React = require('../../../node_modules/react/cjs/react.development');
// const { MemoryRouter, Route, Switch } = require('react-router-dom');
const {
  Route,
  Switch,
} = require('../../../node_modules/react-router-dom/cjs/react-router-dom');

const App = () => (
  <Switch>
    <Route path="/" exact>
      <h1>index-content</h1>
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
