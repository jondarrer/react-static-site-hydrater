import renderAllRoutes from './render-all-routes';
import routeToFileName from './route-to-filename';

class ReactStaticSiteHydrater {
  constructor(options) {
    this.options = options;
    this.options.component =
      options.component || require(options.componentPath);
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ReactStaticSiteHydrater',
      (compilation, callback) => {
        const { routes, component } = this.options;
        const baseHtml = compilation.getAsset('index.html');
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
        callback();
      }
    );
  }
}

export default ReactStaticSiteHydrater;
