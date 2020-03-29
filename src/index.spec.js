/* global describe it expect */

describe('One is one and two is two', () => {
  it('One is one', () => {
    expect('One').toBe('One');
  });
  it('Two is two', () => {
    expect('Two').toBe('Two');
  });
});
