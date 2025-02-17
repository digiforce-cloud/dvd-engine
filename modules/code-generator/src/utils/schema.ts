import * as _ from 'lodash';
import {
  JSExpression,
  NodeData,
  NodeSchema,
  isJSExpression,
  isJSSlot,
  isDOMText,
  ContainerSchema,
  NpmInfo,
  CompositeValue,
  isNodeSchema,
  isJSFunction,
} from '@digiforce-cloud/dvd-types';
import { CodeGeneratorError } from '../types/error';

export function isContainerSchema(x: any): x is ContainerSchema {
  return (
    typeof x === 'object' &&
    x &&
    typeof x.componentName === 'string' &&
    typeof x.fileName === 'string'
  );
}

export function isNpmInfo(x: any): x is NpmInfo {
  return typeof x === 'object' && x && typeof x.package === 'string';
}

const noop = () => undefined;

const handleChildrenDefaultOptions = {
  rerun: false,
};

const DEFAULT_MAX_DEPTH = 100000;

/**
 * 遍历并处理所有的子节点
 * @param children
 * @param handlers
 * @param options
 * @returns
 */
export function handleSubNodes<T>(
  children: NodeSchema['children'],
  handlers: {
    string?: (i: string) => T;
    expression?: (i: JSExpression) => T;
    node?: (i: NodeSchema) => T;
  },
  options?: {
    rerun?: boolean;
    maxDepth?: number; // 防止出现死循环无穷递归
  },
): T[] {
  const opt = {
    ...handleChildrenDefaultOptions,
    ...(options || {}),
  };
  const maxDepth = opt.maxDepth ?? DEFAULT_MAX_DEPTH;
  if (maxDepth <= 0) {
    throw new Error('handleSubNodes maxDepth reached');
  }

  if (Array.isArray(children)) {
    const list: NodeData[] = children as NodeData[];
    return list
      .map((child) => handleSubNodes(child, handlers, { ...opt, maxDepth: maxDepth - 1 }))
      .reduce((p, c) => p.concat(c), []);
  }

  let result: T | undefined;
  const childrenRes: T[] = [];
  if (children === null || children === undefined) {
    return [];
  } else if (isDOMText(children)) {
    const handler = handlers.string || noop;
    result = handler(children);
  } else if (isJSExpression(children)) {
    const handler = handlers.expression || noop;
    result = handler(children);
  } else if (isJSSlot(children)) {
    return handleSubNodes(children.value, handlers, { ...opt, maxDepth: maxDepth - 1 });
  } else if (isNodeSchema(children)) {
    const handler = handlers.node || noop;
    const child = children as NodeSchema;
    result = handler(child);

    if (child.children) {
      const childRes = handleSubNodes(child.children, handlers, opt);
      childrenRes.push(...childRes);
    }

    if (child.props) {
      if (Array.isArray(child.props)) {
        child.props.forEach(({ value }) => {
          const childRes = handleCompositeValueInProps(value);
          childrenRes.push(...childRes);
        });
      } else {
        Object.values(child.props).forEach((value) => {
          const childRes = handleCompositeValueInProps(value);
          childrenRes.push(...childRes);
        });
      }
    }
  } else {
    throw new CodeGeneratorError('handleSubNodes got invalid NodeData', children);
  }

  if (result !== undefined) {
    childrenRes.unshift(result);
  }

  return childrenRes;

  function handleCompositeValueInProps(value: CompositeValue): T[] {
    if (isJSSlot(value)) {
      return handleSubNodes(value.value, handlers, { ...opt, maxDepth: maxDepth - 1 });
    }

    // CompositeArray
    if (Array.isArray(value)) {
      return _.flatMap(value, (v) => handleCompositeValueInProps(v));
    }

    // CompositeObject
    if (
      !isJSExpression(value) &&
      !isJSFunction(value) &&
      typeof value === 'object' &&
      value !== null
    ) {
      return _.flatMap(Object.values(value), (v) => handleCompositeValueInProps(v));
    }

    return [];
  }
}
