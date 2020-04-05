/* global describe it expect */
import { attrsToObject } from './append-attrs-to';

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
});
