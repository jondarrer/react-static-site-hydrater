import React from 'react';

const jsxify = (element, key) => {
  if (!element) return null;
  if (typeof element === 'string') return element;
  const Component = element.type;
  if (key) element.props.key = key;
  const { children, ...props } = element.props;

  if (Array.isArray(children)) {
    return (
      <Component
        {...props}
        children={children.map((child, index) => jsxify(child, index))}
      />
    );
  } else if (typeof children === 'string') {
    return <Component {...props} children={children} />;
  } else if (typeof children === 'object') {
    return <Component {...props} children={jsxify(children)} />;
  } else {
    return <Component {...props} />;
  }
};

export default jsxify;
