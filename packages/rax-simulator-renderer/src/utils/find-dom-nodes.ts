import { isElement } from '@digiforce-cloud/dvd-utils';
import findDOMNode from 'rax-find-dom-node';
// import { isDOMNode } from './is-dom-node';

export function raxFindDOMNodes(instance: any): Array<Element | Text> | null {
  if (!instance) {
    return null;
  }
  if (isElement(instance)) {
    return [instance];
  }
  // eslint-disable-next-line react/no-find-dom-node
  const result = findDOMNode(instance);
  if (Array.isArray(result)) {
    return result;
  }
  return [result];
}
