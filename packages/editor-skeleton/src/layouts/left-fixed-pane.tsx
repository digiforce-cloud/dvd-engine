import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@digiforce-cloud/dvd-editor-core';
import Area from '../area';
import { PanelConfig } from '../types';
import Panel from '../widget/panel';

@observer
export default class LeftFixedPane extends Component<{ area: Area<PanelConfig, Panel> }> {
  componentDidUpdate() {
    // FIXME: dirty fix, need deep think
    this.props.area.skeleton.editor.get('designer')?.touchOffsetObserver();
  }


  render() {
    const { area } = this.props;
    const width = area.current?.config.props?.width;
    const style = width
      ? {
        width,
      }
      : undefined;

    return (
      <div
        className={classNames('lc-left-fixed-pane', {
          'lc-area-visible': area.visible,
        })}
        style={style}
      >
        <Contents area={area} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area<PanelConfig, Panel> }> {
  render() {
    const { area } = this.props;
    return <Fragment>{area.container.items.map((panel) => panel.content)}</Fragment>;
  }
}
