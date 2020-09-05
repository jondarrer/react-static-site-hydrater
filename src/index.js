import writeRoutesToCompilationAssets from './write-routes-to-compilation-assets';

class ReactStaticSiteHydrater {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.make.tapPromise(
      'ReactStaticSiteHydrater',
      async (compilation) => {
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
          async (htmlPluginData, htmlWebpackPluginCallback) =>
            await writeRoutesToCompilationAssets(
              compilation,
              this.options,
              htmlPluginData,
              htmlWebpackPluginCallback
            )
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
