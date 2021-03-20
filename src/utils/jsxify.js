const React = require('react');

const jsxify = (element, key) => {
  if (!element) return null;
  if (typeof element === 'string') return element;
  const Component = element.type;
  if (key !== undefined) element.props.key = key;
  const { children, ...props } = element.props;

  if (Array.isArray(children)) {
    return React.createElement(Component, {
      ...props,
      children: children.map((child, index) => jsxify(child, index)),
    });
  } else if (typeof children === 'string') {
    return React.createElement(Component, { ...props, children });
  } else if (typeof children === 'object') {
    return React.createElement(Component, {
      ...props,
      children: jsxify(children),
    });
  } else {
    return React.createElement(Component, { ...props });
  }
};

module.exports = jsxify;
