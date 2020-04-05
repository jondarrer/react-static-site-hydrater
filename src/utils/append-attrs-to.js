const appendAttrsTo = (node, helmet, tag) => {
  const attrs = attrsToObject(helmet[`${tag}Attributes`].toString());
  Object.keys(attrs).forEach((key) => {
    node.setAttribute(key, attrs[key]);
  });
};

const attrsToObject = (attrs) => {
  if (attrs === '') return {};
  return attrs.split(' ').reduce((acc, attr) => {
    const keyValuePair = attr.split('=');
    acc[keyValuePair[0]] = keyValuePair[1].replace(/\"/g, '');
    return acc;
  }, {});
};

export default appendAttrsTo;
export { appendAttrsTo, attrsToObject };
