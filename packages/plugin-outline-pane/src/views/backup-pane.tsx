import { PureComponent } from 'react';
import { globalContext } from '@digiforce-cloud/dvd-editor-core';
import { PluginProps } from '@digiforce-cloud/dvd-types';
import { OutlinePane } from './pane';

export const Backup = Symbol.for('backup-outline');

export class OutlineBackupPane extends PureComponent<PluginProps> {
  render() {
    return (
      <OutlinePane
        editor={globalContext.get('editor')}
        config={{
          name: Backup,
        }}
      />
    );
  }
}
