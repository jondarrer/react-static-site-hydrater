import renderAllRoutes from './render-all-routes';
import routeToFileName from './route-to-filename';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
const { resolve } = require('path');
// const NativeModule = require('module');

const PLUGIN_NAME = 'ReactStaticSiteHydrater';
const CHILD_FILENAME = '[name]-app.js';

class ReactStaticSiteHydrater {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    let childCompiler;

    compiler.hooks.make.tapPromise(PLUGIN_NAME, async (compilation) => {
      const { routes, component } = this.options;

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
            `${PLUGIN_NAME} is not compatible with your current HtmlWebpackPlugin version.\n` +
              'Please upgrade to HtmlWebpackPlugin >= 4'
          )
        );
        return;
      }

      const outputOptions = {
        filename: CHILD_FILENAME,
        publicPath: '/',
      };

      childCompiler = compilation.createChildCompiler(
        PLUGIN_NAME,
        outputOptions
      );

      childCompiler.context = compiler.context;
      childCompiler.inputFileSystem = compiler.inputFileSystem;
      childCompiler.outputFileSystem = compiler.outputFileSystem;

      // All plugin work is done, call the lifecycle hook.
      childCompiler.hooks.afterPlugins.call(childCompiler);

      new SingleEntryPlugin(compiler.context, './src/app.js', 'index').apply(
        childCompiler
      );

      /*
       * Copy over the parent compilation hash, see issue#15.
       */
      childCompiler.hooks.make.tapAsync(
        PLUGIN_NAME,
        (childCompilation, callback) => {
          childCompilation.hooks.afterHash.tap(PLUGIN_NAME, () => {
            childCompilation.hash = compilation.hash;
            childCompilation.fullHash = compilation.fullHash;
            console.log(
              'childCompiler.hooks.make.tapAsync#childCompilation.hooks.afterHash.tap',
              {
                childCompilation,
              }
            );
          });
          callback();
        }
      );

      childCompiler.hooks.thisCompilation.tap(
        PLUGIN_NAME,
        (childCompilation) => {
          childCompilation.hooks.normalModuleLoader.tap(
            PLUGIN_NAME,
            (loaderContext, module) => {
              // eslint-disable-next-line no-param-reassign
              loaderContext.emitFile = this.emitFile;

              // if (module.request === request) {
              // eslint-disable-next-line no-param-reassign
              // module.loaders = loaders.map((loader) => {
              //   return {
              //     loader: loader.path,
              //     options: loader.options,
              //     ident: loader.ident,
              //   };
              // });
              // }
            }
          );
        }
      );

      let source;

      childCompiler.hooks.afterCompile.tap(PLUGIN_NAME, (childCompilation) => {
        source =
          childCompilation.assets['index-app.js'] &&
          childCompilation.assets['index-app.js'].source();

        console.log('childCompiler.hooks.afterCompile.tap', {
          assets: childCompilation.assets,
        });

        // Remove all chunk assets
        childCompilation.chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            delete childCompilation.assets[file]; // eslint-disable-line no-param-reassign
          });
        });

        compilation.assets = Object.assign(
          childCompilation.assets,
          compilation.assets
        );
        console.log('childCompiler.hooks.afterCompile.tap', {
          assets: Object.keys(compilation.assets),
        });
      });

      compilation.hooks.additionalAssets.tapAsync(
        PLUGIN_NAME,
        (childProcessDone) => {
          childCompiler.runAsChild((err, entries, childCompilation) => {
            console.log('childCompiler.runAsChild');
            console.log({ source });
            if (!source) {
              return callback(
                new Error("Didn't get a result from child compiler")
              );
            }
            console.log('eval', { eval: eval(source) });
          });
          childProcessDone();
        }
      );

      HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
        PLUGIN_NAME,
        (htmlPluginData, htmlWebpackPluginCallback) => {
          const baseHtml = compilation.getAsset(htmlPluginData.outputName);
          console.log({
            assets: Object.keys(compilation.assets),
            options: Object.keys(compilation.options),
          });
          const additionalAssets = renderAllRoutes(
            routes,
            baseHtml.source.source(),
            component
          );
          additionalAssets.forEach((asset) => {
            const filename = routeToFileName(asset.route);
            compilation.assets[filename] = {
              source: function () {
                return asset.renderedAs;
              },
              size: function () {
                return asset.renderedAs.length;
              },
            };
          });

          htmlWebpackPluginCallback(null, htmlPluginData);
        }
      );
      return Promise.resolve();
    });
    compiler.hooks.afterCompile.tapPromise(PLUGIN_NAME, async (compilation) => {
      console.log({ __dirname, a: resolve(__dirname, './src/app.js') });
      const mod = compilation.modules.find((m) =>
        m.identifier().endsWith('app.js')
      );

      // console.log(mod);
      const source = compilation.assets[compilation.options.output.filename];

      /* eslint-disable no-eval */
      // const evaluated = eval(source._value);
      // console.log({ evaluated });
      // let evaled = evalModuleCode(
      //   this,
      //   source,
      //   'C:\\Users\\jonny\\Code\\react-static-site-hydrater\\examples\\basic\\src\\index.js'
      // );
      // console.log({ evaled });
      // console.log(
      //   compilation.modules.map((m) => {
      //     return {
      //       ident: m.identifier(),
      //       id: m.id,
      //       resource: m.issuer.resource,
      //       filename: m.filename,
      //     };
      //   })
      // );
      // console.log(Object.keys(compilation));
    });
  }
}

const verifyHtmlWebpackPluginVersion = (HtmlWebpackPlugin) => {
  // Verify that this HtmlWebpackPlugin supports hooks
  return typeof HtmlWebpackPlugin.getHooks !== 'undefined';
};

// const evalModuleCode = (loaderContext, code, filename) => {
//   const module = new NativeModule(filename, loaderContext);

//   module.paths = NativeModule._nodeModulePaths(loaderContext.context); // eslint-disable-line no-underscore-dangle
//   module.filename = filename;
//   module._compile(code, filename); // eslint-disable-line no-underscore-dangle

//   return module.exports;
// };

export default ReactStaticSiteHydrater;
