/**
 * Wraps the object
 * @param {Object} element
 */
const wrapComponent = (element, baseElement) => {
  if (!baseElement || baseElement === {}) return element;
  if (!element.props) element.props = {};
  if (!element.props.children) element.props.children = [];
  element.props.children.push(baseElement);
  return element;
};

export default wrapComponent;
