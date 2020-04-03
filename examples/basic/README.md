# Basic working sample application

A simple application with 3 routes specified for the static build, as per
[./webpack.config.babel.js](./webpack.config.babel.js):
`['/', '/about', '/404-not-found']`. The last one will fall though to the catch
all as defined in [./src/app.js](./src/app.js):

```jsx
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
```

When built with `npm run build`, it produces the following static files:

```txt
˫dist
  ˫__index.html
  ˫__about.html
  ˫__404-not-found.html
```
