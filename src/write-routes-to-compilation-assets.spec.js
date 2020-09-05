jest.mock('./render-all-routes-with-plugins');
jest.mock('./create-firebase-json-content');

const writeRoutesToCompilationAssets = require('./write-routes-to-compilation-assets');
const renderAllRoutesWithPlugins = require('./render-all-routes-with-plugins');
const createFirebaseJsonContent = require('./create-firebase-json-content');

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
    const options = { componentPath: './test-assets/app.js', plugins: [] };
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
    const options = {
      routes: ['/'],
      componentPath: './test-assets/app.js',
      plugins: [],
    };
    const data = { outputName };
    const cb = jest.fn();
    renderAllRoutesWithPlugins.mockResolvedValue([]);

    // Act
    await writeRoutesToCompilationAssets(compilation, options, data, cb);

    // Assert
    expect(renderAllRoutesWithPlugins).toBeCalledWith(
      options.routes,
      outputSource,
      require(options.componentPath),
      options.plugins
    );
  });

  it('adds the rendered routes as assets to the compilation', async () => {
    // Arrange
    const options = { plugins: [] };
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
    const options = { plugins: [] };
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

  it('does not add firebase.json as an assets to the compilation when not requested', async () => {
    // Arrange
    const options = { plugins: [] };
    const data = { outputName };
    const cb = jest.fn();
    const additionalAssets = [
      { route: '/', renderedAs: 'the index page', filename: '__index.html' },
      {
        route: '/about',
        renderedAs: 'the about page',
        filename: '__about.html',
      },
    ];
    renderAllRoutesWithPlugins.mockResolvedValue(additionalAssets);

    // Act
    await writeRoutesToCompilationAssets(compilation, options, data, cb);

    // Assert
    expect(createFirebaseJsonContent).not.toBeCalled();
    expect(compilation.assets['firebase.json']).toBeUndefined();
  });

  it('adds firebase.json as an assets to the compilation', async () => {
    // Arrange
    const options = { plugins: ['firebase'] };
    const data = { outputName };
    const cb = jest.fn();
    const additionalAssets = [
      { route: '/', renderedAs: 'the index page', filename: '__index.html' },
      {
        route: '/about',
        renderedAs: 'the about page',
        filename: '__about.html',
      },
    ];
    renderAllRoutesWithPlugins.mockResolvedValue(additionalAssets);
    createFirebaseJsonContent.mockReturnValue({ it: 'firebase.json content' });

    // Act
    await writeRoutesToCompilationAssets(compilation, options, data, cb);

    // Assert
    expect(createFirebaseJsonContent).toBeCalledWith(additionalAssets);
    expect(compilation.assets['firebase.json']).toBeDefined();
    expect(compilation.assets['firebase.json'].source).toBeDefined();
    expect(compilation.assets['firebase.json'].source()).toBe(
      '{\n  "it": "firebase.json content"\n}'
    );
    expect(compilation.assets['firebase.json'].size).toBeDefined();
    expect(compilation.assets['firebase.json'].size()).toBe(35);
  });
});
