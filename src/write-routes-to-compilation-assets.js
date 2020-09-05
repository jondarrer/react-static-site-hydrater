const renderAllRoutesWithPlugins = require('./render-all-routes-with-plugins');

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
  const { routes, componentPath, plugins } = options;
  const component = require(componentPath);

  const baseHtml = compilation.getAsset(data.outputName);
  const additionalAssets = await renderAllRoutesWithPlugins(
    routes,
    baseHtml.source.source(),
    component,
    plugins
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
  cb(null, data);
};

module.exports = writeRoutesToCompilationAssets;
