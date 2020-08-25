/* global describe it expect */
import React from 'react';
import jsxify from './jsxify';

describe('jsxify', () => {
  it('should return null when no element is provided', () => {
    expect(jsxify()).toBeNull();
  });
  it('should jsxify a simple element', () => {
    const Component1 = jest.fn();
    expect(
      jsxify({
        type: Component1,
        props: {
          prop1: 123,
        },
      })
    ).toStrictEqual(<Component1 prop1={123} />);
  });
  it('should jsxify a simple element', () => {
    console.log(
      jsxify({
        type: 'p',
        props: {
          children: 'Are you sure?',
        },
      })
    );
    expect(
      jsxify({
        type: 'p',
        props: {
          children: 'Are you sure?',
        },
      })
    ).toStrictEqual(<p children={'Are you sure?'}></p>);
  });
  it.skip('should jsxify nested elements', () => {
    const Component1 = jest.fn();
    const Component2 = jest.fn();
    const Component3 = jest.fn();
    expect(
      jsxify({
        type: Component3,
        props: {
          prop3: 123,
          children: [
            {
              type: Component2,
              props: {
                prop2: 123,
                children: [
                  {
                    type: Component1,
                    props: {
                      prop1: 123,
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    ).toStrictEqual(
      <Component2
        prop3={123}
        children={
          <Component2 prop2={123} children={<Component1 prop1={123} />} />
        }
      />
    );
  });
});
