// NB. In a regular app, you will be able to reference react and react-router-dom
// in the regular way (here commented out). A work-around is in place here
// to ensure the same instance is used when building using the "outer"
// react-static-site-hydrater module in webpack.config.babel.js

// const React = require('react');
const React = require('../../../node_modules/react');
// const { MemoryRouter, Route, Switch } = require('react-router-dom');
const { Route, Switch } = require('../../../node_modules/react-router-dom');
const { Helmet } = require('../../../node_modules/react-helmet-async');

const App = () => (
  <Switch>
    <Route path="/" exact>
      <Helmet>
        <html lang="en"></html>
        <title>Index</title>
        <meta name="description" content="index" />
        <link rel="alternate" href="http://example.com/" hreflang="en" />
      </Helmet>
      <h1>index-content</h1>
    </Route>
    <Route path="/about">
      <Helmet>
        <html lang="en"></html>
        <title>About</title>
        <meta name="description" content="about" />
        <link rel="alternate" href="http://example.com/about" hreflang="en" />
      </Helmet>
      <h1>about-content</h1>
    </Route>
    <Route>
      <Helmet>
        <html lang="en"></html>
        <title>Not Found</title>
        <meta name="description" content="not-found" />
        <link
          rel="alternate"
          href="http://example.com/not-found"
          hreflang="en"
        />
      </Helmet>
      <h1>not-found</h1>
    </Route>
  </Switch>
);

module.exports = App;
