import { Overlay } from '@alifd/next';
import React from 'react';
import { Title, globalContext, Editor } from '@digiforce-cloud/dvd-editor-core';
import { canClickNode } from '@digiforce-cloud/dvd-utils';
import './index.less';

import { Node, ParentalNode } from '@digiforce-cloud/dvd-designer';

const { Popup } = Overlay;

export interface IProps {
  node: Node;
}

export interface IState {
  parentNodes: Node[];
}

type UnionNode = Node | ParentalNode | null;

export default class InstanceNodeSelector extends React.Component<IProps, IState> {
  state: IState = {
    parentNodes: [],
  };

  componentDidMount() {
    const parentNodes = this.getParentNodes(this.props.node);
    this.setState({
      parentNodes,
    });
  }

  // 获取节点的父级节点（最多获取5层）
  getParentNodes = (node: Node) => {
    const parentNodes: any[] = [];
    const { focusNode } = node.document;

    if (node.contains(focusNode) || !focusNode.contains(node)) {
      return parentNodes;
    }

    let currentNode: UnionNode = node;

    while (currentNode && parentNodes.length < 5) {
      currentNode = currentNode.getParent();
      if (currentNode) {
        parentNodes.push(currentNode);
      }
      if (currentNode === focusNode) {
        break;
      }
    }
    return parentNodes;
  };

  onSelect = (node: Node) => (e: unknown) => {
    if (!node) {
      return;
    }

    const canClick = canClickNode(node, e as MouseEvent);

    if (canClick && typeof node.select === 'function') {
      node.select();
      const editor = globalContext.get(Editor);
      const npm = node?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        node?.componentMeta?.componentName ||
        '';
      editor?.emit('designer.border.action', {
        name: 'select',
        selected,
      });
    }
  };

  onMouseOver = (node: Node) => (_: any, flag = true) => {
    if (node && typeof node.hover === 'function') {
      node.hover(flag);
    }
  };

  onMouseOut = (node: Node) => (_: any, flag = false) => {
    if (node && typeof node.hover === 'function') {
      node.hover(flag);
    }
  };

  renderNodes = (/* node: Node */) => {
    const nodes = this.state.parentNodes;
    if (!nodes || nodes.length < 1) {
      return null;
    }
    const children = nodes.map((node, key) => {
      return (
        <div
          key={key}
          onClick={this.onSelect(node)}
          onMouseEnter={this.onMouseOver(node)}
          onMouseLeave={this.onMouseOut(node)}
          className="instance-node-selector-node"
        >
          <div className="instance-node-selector-node-content">
            <Title
              className="instance-node-selector-node-title"
              title={{
                label: node.title,
                icon: node.icon,
              }}
            />
          </div>
        </div>
      );
    });
    return children;
  };

  render() {
    const { node } = this.props;
    return (
      <div className="instance-node-selector">
        <Popup
          trigger={
            <div className="instance-node-selector-current">
              <Title
                className="instance-node-selector-node-title"
                title={{
                  label: node.title,
                  icon: node.icon,
                }}
              />
            </div>
          }
          triggerType="hover"
          offset={[0, 0]}
        >
          <div className="instance-node-selector">{this.renderNodes(node)}</div>
        </Popup>
      </div>
    );
  }
}
