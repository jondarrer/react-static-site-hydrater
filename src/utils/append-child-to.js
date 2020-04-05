const appendChildTo = (node, helmet, tag) => {
  if (helmet[tag].toString() !== `<${tag} data-rh="true"></${tag}>`) {
    node.appendChild(helmet[tag]);
  }
};

export default appendChildTo;
