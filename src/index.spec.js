/* global describe it expect */
const { resolve } = require('path');

const ReactStaticSiteHydrater = require('./');

describe('ReactStaticSiteHydrater', () => {
  const tapMakePromise = jest.fn();
  const tapAfterEmitAsync = jest.fn();
  const compiler = {
    hooks: {
      make: {
        tapPromise: tapMakePromise,
      },
    },
    options: {
      plugins: [
        {
          constructor: {
            name: 'HtmlWebpackPlugin',
            getHooks: () => {
              return {
                afterEmit: {
                  tapAsync: tapAfterEmitAsync,
                },
              };
            },
          },
        },
      ],
    },
  };
  const createCompilation = (assets) => {
    return {
      assets,
      getAsset: (name) => assets[name],
    };
  };
  const baseFilename = 'xyz.html';
  const createHtmlPluginData = () => {
    return { plugin: { options: {} }, outputName: baseFilename };
  };
  const htmlWebpackPluginCallback = jest.fn();
  describe('apply', () => {
    beforeEach(() => {
      tapMakePromise.mockClear();
      tapAfterEmitAsync.mockClear();
      htmlWebpackPluginCallback.mockClear();
    });
    it('v3 it should add the configured routes as assets', (done) => {
      const assets = {};
      assets[baseFilename] = {
        source: { source: () => 'abc' },
        size: () => {},
      };
      tapMakePromise.mockImplementation((name, makeCallback) => {
        expect(name).toBe('ReactStaticSiteHydrater');
        return makeCallback(createCompilation(assets));
      });
      tapAfterEmitAsync.mockImplementation((name, afterEmitAsync) => {
        expect(name).toBe('ReactStaticSiteHydrater');
        afterEmitAsync(createHtmlPluginData(), htmlWebpackPluginCallback).then(
          () => {
            expect(assets['__index.html']).toBeDefined();
            expect(assets['__about.html']).toBeDefined();
            expect(htmlWebpackPluginCallback).toBeCalled();
            done();
          }
        );
      });
      const sut = new ReactStaticSiteHydrater({
        routes: ['/', '/about'],
        componentPath: resolve(__dirname, './test-assets/app.js'),
        baseFilename,
        plugins: ['react-router'],
      });
      sut.apply(compiler);
      expect(tapMakePromise).toBeCalled();
    });
  });
});
