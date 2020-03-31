class ReactStaticSiteHydrater {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ReactStaticSiteHydrater',
      (compilation, callback) => {
        const baseHtml = compilation.getAsset('index.html');
        compilation.assets['__index.html'] = {
          source: function () {
            return baseHtml.source.source();
          },
          size: function () {
            return baseHtml.source.size();
          },
        };
        callback();
      }
    );
  }
}

module.exports = ReactStaticSiteHydrater;
