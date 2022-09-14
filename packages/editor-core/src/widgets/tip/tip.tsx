import { Component } from 'react';
import { TipConfig } from '@digiforce-cloud/dvd-types';
import { uniqueId } from '@digiforce-cloud/dvd-utils';
import { postTip } from './tip-handler';

export class Tip extends Component<TipConfig> {
  private id = uniqueId('tips$');

  componentWillUnmount() {
    postTip(this.id, null);
  }

  render() {
    postTip(this.id, this.props);
    return <meta data-role="tip" data-tip-id={this.id} />;
  }
}
