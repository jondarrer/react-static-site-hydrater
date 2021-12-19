const renderAllRoutes = require('./render-all-routes');
const renderAllRoutesWithPlugins = require('./render-all-routes-with-plugins');
const routeToFileName = require('./route-to-filename');
const _eval = require('eval');
const { createFsFromVolume, Volume } = require('memfs');

const PLUGIN_NAME = 'ReactStaticSiteHydrater';

class ReactStaticSiteHydrater {
  constructor(options, context) {
    this.options = options;
    this.context = context;
  }

  getAsset(name, compilation, { assetsByChunkName }) {
    let retval = compilation.assets[name];

    if (retval != null) {
      return retval;
    }

    retval = assetsByChunkName[name];
    if (retval == null) {
      return null;
    }

    if (Array.isArray(retval)) {
      retval = retval[0];
    }

    return compilation.assets[retval];
  }

  apply(compiler) {
    //   // compiler.plugin('this-compilation', (compilation) => {
    //   //   compilation.plugin('optimize-assets', (_, cb) => {
    //   //     const stats = compilation.getStats().toJson();
    //   //     const asset = this.getAsset('bundle.js', compilation, stats);
    //   //     let entry = _eval(asset.source(), true);
    //   //     let App = entry;
    //   //   });
    //   // });
    //   compiler.hooks.thisCompilation.call(
    //     PLUGIN_NAME,
    //     (compilation) => {
    //       compilation.hooks.optimizeAssets.tapAsync(
    //         PLUGIN_NAME,
    //         async (_) => {
    //           const stats = compilation.getStats().toJson();
    //           const asset = this.getAsset('bundle.js', compilation, stats);
    //           let entry = _eval(asset.source(), true);
    //           let App = entry;
    //         }
    //       );
    //     }
    //   );
    const {
      node: { NodeTemplatePlugin, NodeTargetPlugin },
      library: { EnableLibraryPlugin },
      LoaderTargetPlugin,
      EntryPlugin,
    } = compiler.webpack;

    compiler.hooks.make.tapPromise(PLUGIN_NAME, async (compilation) => {
      const { routes, component, plugins, app } = this.options;

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

      const childOptions = {
        filename: 'the-child-bundle.js',
        path:
          '/Users/jondarrer/Code/react-static-site-hydrater/examples/basic/dist',
        library: {
          type: 'module',
        },
        module: true,
      };
      const childPlugins = [
        new NodeTargetPlugin(),
        new NodeTemplatePlugin(childOptions),
        new LoaderTargetPlugin('node'),
        // new EnableLibraryPlugin('var'),
      ];
      const childCompiler = compilation.createChildCompiler(
        PLUGIN_NAME,
        childOptions,
        childPlugins
      );
      childCompiler.context = compiler.context;
      childCompiler.options.experiments = {
        ...(childCompiler.options.experiments || {}),
        outputModule: true,
      };
      childCompiler.options.target = 'node';
      childCompiler.options.externals = {
        // Don't bundle react or react-dom
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React',
        },
        'react-dom/server': {
          commonjs: 'react-dom/server',
          commonjs2: 'react-dom/server',
          amd: 'ReactDOMServer',
          root: 'ReactDOMServer',
        },
        'react-router-dom': {
          commonjs: 'react-router-dom',
          commonjs2: 'react-router-dom',
          amd: 'ReactRouterDOM',
          root: 'ReactRouterDOM',
        },
        'react-helmet-async': {
          commonjs: 'react-helmet-async',
          commonjs2: 'react-helmet-async',
          amd: 'ReactHelmetAsync',
          root: 'ReactHelmetAsync',
        },
        '@apollo/client': {
          commonjs: '@apollo/client',
          commonjs2: '@apollo/client',
          amd: 'ApolloClient',
          root: 'ApolloClient',
        },
      };
      // const fs = createFsFromVolume(new Volume());
      // childCompiler.outputFileSystem = fs;
      childCompiler.options.plugins = childPlugins;
      childCompiler.hooks.afterPlugins.call(childCompiler);
      new EntryPlugin(compiler.context, app, 'the-child-app.js').apply(
        childCompiler
      );
      // childCompiler.options.module = { ...childCompiler.options.module };
      // childCompiler.options.module.parser = {
      //   ...childCompiler.options.module.parser,
      // };
      // childCompiler.options.module.parser.javascript = {
      //   ...childCompiler.options.module.parser.javascript,
      //   url: 'relative',
      // };
      // childCompiler.hooks.make.tapPromise(
      //   PLUGIN_NAME,
      //   async (childCompilation) => {
      //     console.log('childCompiler.hooks.make.tapPromise');
      //   }
      // );
      childCompiler.runAsChild((err, entries, childCompilation) => {
        console.log('childCompiler.runAsChild(err, entries, childCompilation)');
      });

      HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
        PLUGIN_NAME,
        async (htmlPluginData, htmlWebpackPluginCallback) => {
          const baseHtml = compilation.getAsset(htmlPluginData.outputName);

          const stats = compilation.getStats().toJson();
          const asset = this.getAsset(
            'the-child-bundle.js',
            compilation,
            stats
          );
          let entry = _eval(asset.source(), true);
          const MyApp = require('/Users/jondarrer/Code/react-static-site-hydrater/examples/basic/dist/the-child-bundle.js');
          // this.MyApp;
          entry = _eval(
            'module.exports = function test() {return "Testing, 1, 3, 2!";};',
            true
          );
          let App = entry;
          // if (entry?.hasOwnProperty('App')) {
          //   App = entry['App'];
          // }

          let additionalAssets;
          if (plugins) {
            additionalAssets = await renderAllRoutesWithPlugins(
              routes,
              baseHtml.source.source(),
              App,
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
    });

    // compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
    //   // Explore each chunk (build output):
    //   compilation.chunks.forEach((chunk) => {
    //     // Explore each module within the chunk (built inputs):
    //     let i = 0;
    //     compilation.chunkGraph.getChunkModules(chunk).forEach((module) => {
    //       ++i;
    //       if (module.context?.endsWith('src')) {
    //         const exportInfo = compilation.chunkGraph.moduleGraph.getExportInfo(
    //           module
    //         );
    //         console.log({ i, module, exportInfo });
    //       }
    //     });

    //     chunk.files.forEach((filename) => {
    //       // Get the asset source for each file generated by the chunk:
    //       var asset = compilation.assets[filename];
    //       console.log({ asset: asset._children });
    //     });
    //   });

    //   callback();
    // });
  }
}

const verifyHtmlWebpackPluginVersion = (HtmlWebpackPlugin) => {
  // Verify that this HtmlWebpackPlugin supports hooks
  return typeof HtmlWebpackPlugin.getHooks !== 'undefined';
};

module.exports = ReactStaticSiteHydrater;
