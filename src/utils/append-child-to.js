import { parse } from 'node-html-parser';

const appendChildTo = (node, helmet, tag) => {
  if (helmet[tag].toString() !== `<${tag} data-rh="true"></${tag}>`) {
    node.appendChild(parse(helmet[tag]));
  }
};

export default appendChildTo;
