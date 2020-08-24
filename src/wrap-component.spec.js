/* global describe it expect */
import wrapComponent from './wrap-component';

describe('wrapComponent', () => {
  it('should wrap 1 component', () => {
    const Component1 = () => {};
    const wrappedComponent = wrapComponent({
      type: Component1,
      props: {
        prop1: 123,
      },
    });
    expect(wrappedComponent).toStrictEqual({
      type: Component1,
      props: {
        prop1: 123,
      },
    });
  });
  it('should wrap 3 components', () => {
    const Component1 = () => {};
    const Component2 = () => {};
    const Component3 = () => {};
    const wrappedComponent1 = wrapComponent({
      type: Component1,
      props: {
        prop1: 123,
      },
    });
    const wrappedComponent2 = wrapComponent(
      {
        type: Component2,
        props: {
          prop2: 123,
        },
      },
      wrappedComponent1
    );
    const wrappedComponent3 = wrapComponent(
      {
        type: Component3,
        props: {
          prop3: 123,
        },
      },
      wrappedComponent2
    );
    expect(wrappedComponent1).toStrictEqual({
      type: Component1,
      props: {
        prop1: 123,
      },
    });
    expect(wrappedComponent2).toStrictEqual({
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
    });
    expect(wrappedComponent3).toStrictEqual({
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
    });
  });
});
