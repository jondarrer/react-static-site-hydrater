import renderAllRoutesWithPlugins from './render-all-routes-with-plugins';
import createFirebaseJsonContent from './create-firebase-json-content';

/**
 * Takes a list of routes and plugins, gets the routes rendered using the plugins and writes the results to the Webpack compilation
 *
 * @param {any} compilation The Webpack compilation object (see https://webpack.js.org/api/compilation-object/)
 * @param {import("./models").WebpackPluginOptions} options
 * @param {import("./models").HtmlWebpackPluginAfterEmitData} data (see https://github.com/jantimon/html-webpack-plugin#afteremit-hook)
 * @param {Function} cb
 */
const writeRoutesToCompilationAssets = async (
  compilation,
  options,
  data,
  cb
) => {
  const baseHtml = compilation.getAsset(data.outputName);
  const additionalAssets = await renderAllRoutesWithPlugins(
    options.routes,
    baseHtml.source.source(),
    options.component,
    options.plugins
  );

  for (let i = 0; i < additionalAssets.length; i++) {
    const asset = additionalAssets[i];
    compilation.assets[asset.filename] = {
      source: function () {
        return asset.renderedAs;
      },
      size: function () {
        return asset.renderedAs.length;
      },
    };
  }
  if (options.plugins.includes('firebase')) {
    const firebaseJsonContent = JSON.stringify(
      createFirebaseJsonContent(additionalAssets),
      null,
      2
    );
    compilation.assets['firebase.json'] = {
      source: function () {
        return firebaseJsonContent;
      },
      size: function () {
        return firebaseJsonContent.length;
      },
    };
  }
  cb(null, data);
};

export default writeRoutesToCompilationAssets;
