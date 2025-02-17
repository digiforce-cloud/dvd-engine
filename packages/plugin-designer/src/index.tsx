import React, { PureComponent } from 'react';
import { Editor, engineConfig, globalContext } from '@digiforce-cloud/dvd-editor-core';
import { DesignerView, Designer } from '@digiforce-cloud/dvd-designer';
import { Asset } from '@digiforce-cloud/dvd-utils';
import './index.scss';

export interface PluginProps {
  editor: Editor;
}

interface DesignerPluginState {
  componentMetadatas?: any[] | null;
  library?: any[] | null;
  extraEnvironment?: any[] | null;
  renderEnv?: string;
  device?: string;
  locale?: string;
  designMode?: string;
  deviceClassName?: string;
  simulatorUrl: Asset | null;
  // @TODO 类型定义
  requestHandlersMap: any;
}

export default class DesignerPlugin extends PureComponent<PluginProps, DesignerPluginState> {
  static displayName: 'LowcodePluginDesigner';

  state: DesignerPluginState = {
    componentMetadatas: null,
    library: null,
    extraEnvironment: null,
    renderEnv: 'default',
    device: 'default',
    locale: '',
    designMode: 'live',
    deviceClassName: '',
    simulatorUrl: null,
    requestHandlersMap: null,
  };

  private _mounted = true;

  constructor(props: any) {
    super(props);
    this.setupAssets();
  }

  private async setupAssets() {
    const editor = globalContext.get('editor');
    try {
      const assets = await editor.onceGot('assets');
      const renderEnv = engineConfig.get('renderEnv') || editor.get('renderEnv');
      const device = engineConfig.get('device') || editor.get('device');
      const locale = engineConfig.get('locale') || editor.get('locale');
      const designMode = engineConfig.get('designMode') || editor.get('designMode');
      const deviceClassName = engineConfig.get('deviceClassName') || editor.get('deviceClassName');
      const simulatorUrl = engineConfig.get('simulatorUrl') || editor.get('simulatorUrl');
      // @TODO setupAssets 里设置 requestHandlersMap 不太合适
      const requestHandlersMap = engineConfig.get('requestHandlersMap') || editor.get('requestHandlersMap');
      if (!this._mounted) {
        return;
      }
      const { components, packages, extraEnvironment, utils } = assets;
      const state = {
        componentMetadatas: components || [],
        library: packages || [],
        utilsMetadata: utils || [],
        extraEnvironment,
        renderEnv,
        device,
        designMode,
        deviceClassName,
        simulatorUrl,
        requestHandlersMap,
        locale,
      };
      this.setState(state);
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  private handleDesignerMount = (designer: Designer): void => {
    const editor = globalContext.get('editor');
    editor.set('designer', designer);
    editor.emit('designer.ready', designer);
    editor.onGot('schema', (schema) => {
      designer.project.open(schema);
    });
  };

  render(): React.ReactNode {
    const editor = globalContext.get('editor');
    const {
      componentMetadatas,
      utilsMetadata,
      library,
      extraEnvironment,
      renderEnv,
      device,
      designMode,
      deviceClassName,
      simulatorUrl,
      requestHandlersMap,
      locale,
    } = this.state;

    if (!library || !componentMetadatas) {
      // TODO: use a Loading
      return null;
    }

    return (
      <DesignerView
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        editor={editor}
        designer={editor.get('designer')}
        componentMetadatas={componentMetadatas}
        simulatorProps={{
          library,
          utilsMetadata,
          extraEnvironment,
          renderEnv,
          device,
          locale,
          designMode,
          deviceClassName,
          simulatorUrl,
          requestHandlersMap,
        }}
      />
    );
  }
}
