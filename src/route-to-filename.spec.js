/* global describe it expect */
const routeToFilename = require('./route-to-filename');

describe('routeToFilename', () => {
  it('should convert / to __index.html', () => {
    const filename = routeToFilename('/');
    expect(filename).toBe('__index.html');
  });
  it('should convert /about to __about.html', () => {
    const filename = routeToFilename('/about');
    expect(filename).toBe('__about.html');
  });
  it('should convert /ro/ to __ro_despre.html', () => {
    const filename = routeToFilename('/ro/despre');
    expect(filename).toBe('__ro_despre.html');
  });
});
