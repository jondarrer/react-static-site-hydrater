const React = require('react');
const { Route, Switch } = require('react-router-dom');

const BasicExample = (
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

module.exports = BasicExample;
