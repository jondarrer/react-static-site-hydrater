/* global describe it expect */
const { attrsToObject } = require('./append-attrs-to');

describe('attrsToObject', () => {
  it('should return {} from ~ (empty string)', () => {
    expect(attrsToObject('')).toEqual({});
  });
  it('should extract {lang: "en", bla: "123"} from ~lang="en" bla="123"', () => {
    expect(attrsToObject('lang="en" bla="123"')).toEqual({
      lang: 'en',
      bla: '123',
    });
  });
  it('should extract {class: "class-1 class-2"} from ~lang="class-1 class-2"', () => {
    expect(attrsToObject('class="class-1 class-2"')).toEqual({
      class: 'class-1 class-2',
    });
  });
});
