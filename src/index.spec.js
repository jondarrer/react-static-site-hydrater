/* global describe it expect */
import React from 'react';

import ReactStaticSiteHydrater from './';

describe('ReactStaticSiteHydrater', () => {
  const tapAsync = jest.fn();
  const compiler = {
    hooks: {
      emit: {
        tapAsync,
      },
    },
  };
  const createCompilation = (assets) => {
    return {
      assets,
      getAsset: (name) => assets[name],
    };
  };
  const callback = jest.fn();
  describe('apply', () => {
    beforeEach(() => {
      tapAsync.mockClear();
      callback.mockClear();
    });
    it('it should add the configured routes as assets', (done) => {
      const baseFilename = 'xyz.html';
      const assets = {};
      assets[baseFilename] = {
        source: { source: () => 'abc' },
        size: () => {},
      };
      tapAsync.mockImplementation((name, emitCB) => {
        expect(name).toBe('ReactStaticSiteHydrater');
        emitCB(createCompilation(assets), callback);
        expect(callback).toBeCalled();
        expect(assets['__index.html']).toBeDefined();
        expect(assets['__about.html']).toBeDefined();
        done();
      });
      const sut = new ReactStaticSiteHydrater({
        routes: ['/', '/about'],
        component: () => <div />,
        baseFilename,
      });
      sut.apply(compiler);
    });
  });
});
