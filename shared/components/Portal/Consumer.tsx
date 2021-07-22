import React from 'react';
import type { PortalMethods } from './context';

export type PortalConsumerProps = {
  hostName: string;
  manager: PortalMethods;
  children: React.ReactNode;
};

export class PortalConsumer extends React.Component<PortalConsumerProps> {
  _key: any;
  componentDidMount() {
    if (!this.props.manager) {
      throw new Error(
        'Looks like you forgot to wrap your root component with `PortalHost` component.\n'
      );
    }

    this._key = this.props.manager.mount(
      this.props.hostName,
      this.props.children
    );
  }

  componentDidUpdate() {
    this.props.manager.update(
      this.props.hostName,
      this._key,
      this.props.children
    );
  }

  componentWillUnmount() {
    this.props.manager.unmount(this.props.hostName, this._key);
  }

  render() {
    return null;
  }
}
