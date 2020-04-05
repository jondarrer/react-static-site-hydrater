# React-Helmet working sample application

An application using
[react-helmet-async](https://github.com/staylor/react-helmet-async)'s `Helmet` &
`HelmetProvider`, and 3 routes specified for the static build, as per
[./webpack.config.babel.js](./webpack.config.babel.js):
`['/', '/about', '/404-not-found']`. The last one will fall though to the catch
all as defined in [./src/app.js](./src/app.js):

```jsx
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
```

When built with `npm run build`, it produces the following static files, with
the head tags and html/body attributes rendered:

```txt
˫dist
  ˫__index.html
  ˫__about.html
  ˫__404-not-found.html
```
