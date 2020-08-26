import renderAllRoutes from './render-all-routes';
import renderAllRoutesWithPlugins from './render-all-routes-with-plugins';
import routeToFileName from './route-to-filename';

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
              console.log(
                'plugins detected, so using renderAllRoutesWithPlugins'
              );
              additionalAssets = renderAllRoutesWithPlugins(
                routes,
                baseHtml.source.source(),
                component,
                plugins
              );
            } else {
              additionalAssets = renderAllRoutes(
                routes,
                baseHtml.source.source(),
                component
              );
            }
            additionalAssets.forEach(async (asset) => {
              const filename = routeToFileName(asset.route);
              let renderedAs;
              if (plugins) {
                renderedAs = await asset.renderedAs;
              } else {
                renderedAs = asset.renderedAs;
              }
              compilation.assets[filename] = {
                source: function () {
                  return renderedAs;
                },
                size: function () {
                  return renderedAs.length;
                },
              };
            });
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

export default ReactStaticSiteHydrater;
