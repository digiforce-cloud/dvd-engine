import { Component } from 'react';
import { TipContainer, observer } from '@digiforce-cloud/dvd-editor-core';
import classNames from 'classnames';
import { Skeleton } from '../skeleton';
import TopArea from './top-area';
import LeftArea from './left-area';
import LeftFixedPane from './left-fixed-pane';
import LeftFloatPane from './left-float-pane';
import Toolbar from './toolbar';
import MainArea from './main-area';
import BottomArea from './bottom-area';
import RightArea from './right-area';
import './workbench.less';
import { SkeletonContext } from '../context';
import { EditorConfig, PluginClassSet } from '@digiforce-cloud/dvd-types';

@observer
export class Workbench extends Component<{ skeleton: Skeleton; config?: EditorConfig; components?: PluginClassSet; className?: string; topAreaItemClassName?: string }> {
  constructor(props: any) {
    super(props);
    const { config, components, skeleton } = this.props;
    skeleton.buildFromConfig(config, components);
  }

  // componentDidCatch(error: any) {
  //   globalContext.get(Editor).emit('editor.skeleton.workbench.error', error);
  // }

  render() {
    const { skeleton, className, topAreaItemClassName } = this.props;
    return (
      <div className={classNames('lc-workbench', className)}>
        <SkeletonContext.Provider value={this.props.skeleton}>
          <TopArea area={skeleton.topArea} itemClassName={topAreaItemClassName} />
          <div className="lc-workbench-body">
            <LeftArea area={skeleton.leftArea} />
            <LeftFloatPane area={skeleton.leftFloatArea} />
            <LeftFixedPane area={skeleton.leftFixedArea} />
            <div className="lc-workbench-center">
              <Toolbar area={skeleton.toolbar} />
              <MainArea area={skeleton.mainArea} />
              <BottomArea area={skeleton.bottomArea} />
            </div>
            <RightArea area={skeleton.rightArea} />
          </div>
          <TipContainer />
        </SkeletonContext.Provider>
      </div>
    );
  }
}
