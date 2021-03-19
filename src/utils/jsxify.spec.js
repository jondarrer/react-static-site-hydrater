/* global describe it expect */
const React = require('react');
const jsxify = require('./jsxify');

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
    ).toStrictEqual(React.createElement(Component1, { prop1: 123 }));
  });
  it('should jsxify a simple element', () => {
    expect(
      jsxify({
        type: 'p',
        props: {
          children: 'Are you sure?',
        },
      })
    ).toStrictEqual(React.createElement('p', null, 'Are you sure?'));
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
      React.createElement(
        Component2,
        {
          prop3: 123,
        },
        React.createElement(
          Component2,
          {
            prop2: 123,
          },
          React.createElement(Component1, {
            prop1: 123,
          })
        )
      )
    );
  });
});
