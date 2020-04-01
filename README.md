# react-static-site-hydrater

A Webpack plugin to hydrate static React sites using ReactDOM.hydrate to
pre-build the static site

## Usage

### Installation

```bash
npm install --save-dev react-static-site-hydrater
```

### Webpack configuration

The plugin will generate HTML5 files for the routes you specify. Just add the
plugin to your webpack configuration as follows, along with the routes you want
to generate:

```js
const ReactStaticSiteHydraterPlugin = require('react-static-site-hydrater');

module.exports = {
  plugins: [
    new ReactStaticSiteHydraterPlugin({
      routes: ['/', '/about', '/contact-us'],
    }),
  ],
};
```

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
npm run build
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
