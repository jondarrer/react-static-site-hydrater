const renderAllRoutes = require('./render-all-routes');
const renderAllRoutesWithPlugins = require('./render-all-routes-with-plugins');
const routeToFileName = require('./route-to-filename');

class ReactStaticSiteHydrater {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.make.tapPromise(
      'ReactStaticSiteHydrater',
      async (compilation) => {
        const { routes, component, plugins } = this.options;

        // Hook into the html-webpack-plugin processing and add the html
        // Inspired by https://github.com/jantimon/favicons-webpack-plugin/blob/master/src/index.js
        const HtmlWebpackPlugin = compiler.options.plugins
          .map(({ constructor }) => constructor)
          .find(
            (constructor) =>
              constructor && constructor.name === 'HtmlWebpackPlugin'
          );

        if (!verifyHtmlWebpackPluginVersion(HtmlWebpackPlugin)) {
          compilation.errors.push(
            new Error(
              'ReactStaticSiteHydrater is not compatible with your current HtmlWebpackPlugin version.\n' +
                'Please upgrade to HtmlWebpackPlugin >= 4'
            )
          );
          return;
        }

        HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
          'ReactStaticSiteHydrater',
          async (htmlPluginData, htmlWebpackPluginCallback) => {
            const baseHtml = compilation.getAsset(htmlPluginData.outputName);
            let additionalAssets;
            if (plugins) {
              additionalAssets = await renderAllRoutesWithPlugins(
                routes,
                baseHtml.source.source(),
                component,
                plugins
              );
            } else {
              console.log(
                '\x1b[33m%s\x1b[0m',
                "DEPRECATION WARNING\nPlease provide a list of plugins in the options for ReactStaticSiteHydrater as per https://github.com/jondarrer/react-static-site-hydrater#options, as builds which don't specify these will no longer work in future versions"
              );
              additionalAssets = renderAllRoutes(
                routes,
                baseHtml.source.source(),
                component
              );
            }
            for (let i = 0; i < additionalAssets.length; i++) {
              const asset = additionalAssets[i];
              const filename = routeToFileName(asset.route);
              compilation.assets[filename] = {
                source: function () {
                  return asset.renderedAs;
                },
                size: function () {
                  return asset.renderedAs.length;
                },
              };
            }
            htmlWebpackPluginCallback(null, htmlPluginData);
          }
        );
        return Promise.resolve();
      }
    );
  }
}

const verifyHtmlWebpackPluginVersion = (HtmlWebpackPlugin) => {
  // Verify that this HtmlWebpackPlugin supports hooks
  return typeof HtmlWebpackPlugin.getHooks !== 'undefined';
};

module.exports = ReactStaticSiteHydrater;
