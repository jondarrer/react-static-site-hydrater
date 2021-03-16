# react-static-site-hydrater

## 🚧 This plugin is currently a work in progress 🚧

[![Build Status](https://travis-ci.com/jondarrer/react-static-site-hydrater.svg?branch=master)](https://travis-ci.com/jondarrer/react-static-site-hydrater)

**Due to this being a work in progress, it is necessary to either write your
application in ES5 without import/export, or to use Babel to transform your code
prior to Webpack being called. This is because it is currently necessary to
import parts of the app into the Webpack build.**

A Webpack plugin to create html static file sites from React apps using
ReactDOM.hydrate, which can be hosted statically. They can also make use of
Apollo for GraphQL and Helmet for SEO/social.

## Usage

### Installation

```bash
npm install --save-dev react-static-site-hydrater
```

### Webpack configuration

The plugin will generate HTML5 files for the routes you specify. Just add the
plugin to your webpack configuration as follows, along with the routes you want
to generate. It works in conjunction with
[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin):

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactStaticSiteHydrater = require('react-static-site-hydrater').default;

const App = require('./src/app');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    new ReactStaticSiteHydrater({
      routes: ['/', '/about', '/contact-us'],
      component: App,
    }),
  ],
};
```

NB. See the [examples](./examples) folder for working sample applications.

This will generate the static site within the output folder (here _dist_):

```txt
˫dist
  ˫__index.html
  ˫__about.html
  ˫__contact-us.html
```

It will also produce a new or update an existing
[Firebase hosting config](https://firebase.google.com/docs/hosting/full-config)
(_./firebase.json_) with rewrites to the static site for the routes specified
above:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    // Add the "rewrites" attribute within "hosting"
    "rewrites": [
      {
        // Serves index.html for requests to files or directories that do not exist
        "source": "**",
        "destination": "/__index.html"
      },
      {
        // Serves __about.html for requests to /about
        "source": "/about",
        "destination": "/__about.html"
      },
      {
        // Serves __contact-us.html for requests to /contact-us
        "source": "/contact-us",
        "destination": "/__contact-us.html"
      },
      {
        // Excludes specified pathways from rewrites
        "source": "!/@(js|css)/**",
        "destination": "/__index.html"
      }
    ]
  }
}
```

## Options

|      Name       |                Type                | Default | Description                                                                                                                         |
| :-------------: | :--------------------------------: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------- |
|  **`routes`**   |         `{Array<String>}`          |   []    | The routes to build (e.g. ['/', '/about', '/contact-us'])                                                                           |
| **`component`** |           `{Component}`            |         | The React component with the routing/Switch, but not the Router                                                                     |
|  **`plugins`**  | `{Array<String|PluginDescriptor>}` |         | List of plugins to use to create the static content (e.g. `['react-router', 'helmet', ['apollo', { client: new ApolloClient() }]]`) |

## Remaining features to be implemented

This Webpack plugin is not yet feature complete. It requires the following to be
implemented:

- Generation of the _./firebase.json_ file

## Developing

### Clone the repo and install dependencies

```bash
git clone git@github.com:jondarrer/react-static-site-hydrater
cd react-static-site-hydrater
npm install
```

### Test

Tests are run using Jest.

```bash
npm test
```

### Build

```bash
# Include mode=development to build in development mode
# https://webpack.js.org/configuration/mode/
npm run build -- --mode=development 
```

### Publish

Travis CI is the integration tool used to publish the package. It will publish
new versions to [npm](https://docs.npmjs.com/cli/version), which can be created
and tagged in Git using the [npm version](https://docs.npmjs.com/cli/version)
tool:

```bash
npm version {patch/minor/major} -m ":bookmark: Update release version to %s"
git push --tags
```
