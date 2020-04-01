const renderAllRoutes = require('./render-all-routes');
const routeToFileName = require('./route-to-filename');

class ReactStaticSiteHydrater {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ReactStaticSiteHydrater',
      (compilation, callback) => {
        const baseHtml = compilation.getAsset('index.html');
        const additionalAssets = renderAllRoutes(
          this.options.routes,
          baseHtml.source.source()
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
        callback();
      }
    );
  }
}

module.exports = ReactStaticSiteHydrater;
