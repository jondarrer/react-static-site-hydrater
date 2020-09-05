jest.mock('./render-all-routes-with-plugins');

import writeRoutesToCompilationAssets from './write-routes-to-compilation-assets';
import renderAllRoutesWithPlugins from './render-all-routes-with-plugins';

describe('writeRoutesToCompilationAssets', () => {
  const outputName = 'default.html';
  const outputSource = 'default.html source';
  const compilation = {
    assets: {},
    getAsset: function (name) {
      return this.assets[name];
    },
  };

  beforeEach(() => {
    compilation.assets = {};
    compilation.assets[outputName] = {
      source: { source: () => outputSource },
      size: () => {},
    };
  });

  it('calls the callback with the data originally passed in', async () => {
    // Arrange
    const options = {};
    const data = { outputName };
    const cb = jest.fn();
    renderAllRoutesWithPlugins.mockResolvedValue([]);

    // Act
    await writeRoutesToCompilationAssets(compilation, options, data, cb);

    // Assert
    expect(cb).toBeCalledWith(null, data);
  });

  it('calls renderAllRoutesWithPlugins with the correct parameters', async () => {
    // Arrange
    const options = { routes: ['/'], component: () => {}, plugins: [] };
    const data = { outputName };
    const cb = jest.fn();
    renderAllRoutesWithPlugins.mockResolvedValue([]);

    // Act
    await writeRoutesToCompilationAssets(compilation, options, data, cb);

    // Assert
    expect(renderAllRoutesWithPlugins).toBeCalledWith(
      options.routes,
      outputSource,
      options.component,
      options.plugins
    );
  });

  it('adds the rendered routes as assets to the compilation', async () => {
    // Arrange
    const options = {};
    const data = { outputName };
    const cb = jest.fn();
    renderAllRoutesWithPlugins.mockResolvedValue([
      { route: '/', renderedAs: 'the index page', filename: '__index.html' },
      {
        route: '/about',
        renderedAs: 'the about page',
        filename: '__about.html',
      },
    ]);

    // Act
    await writeRoutesToCompilationAssets(compilation, options, data, cb);

    // Assert
    expect(compilation.assets['__index.html']).toBeDefined();
    expect(compilation.assets['__about.html']).toBeDefined();
  });

  it('adds the rendered routes with source and size for each asset to the compilation', async () => {
    // Arrange
    const options = {};
    const data = { outputName };
    const cb = jest.fn();
    renderAllRoutesWithPlugins.mockResolvedValue([
      { route: '/', renderedAs: 'the index page', filename: '__index.html' },
      {
        route: '/about',
        renderedAs: 'the about page',
        filename: '__about.html',
      },
    ]);

    // Act
    await writeRoutesToCompilationAssets(compilation, options, data, cb);

    // Assert
    expect(compilation.assets['__index.html'].source).toBeDefined();
    expect(compilation.assets['__index.html'].source()).toBe('the index page');
    expect(compilation.assets['__index.html'].size).toBeDefined();
    expect(compilation.assets['__index.html'].size()).toBe(14);
    expect(compilation.assets['__about.html'].source).toBeDefined();
    expect(compilation.assets['__about.html'].source()).toBe('the about page');
    expect(compilation.assets['__about.html'].size).toBeDefined();
    expect(compilation.assets['__about.html'].size()).toBe(14);
  });
});
