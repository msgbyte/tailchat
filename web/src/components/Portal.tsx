import React from 'react';
import { buildPortal, DefaultEventEmitter } from 'tailchat-shared';

const eventEmitter = new DefaultEventEmitter();

const { PortalHost, PortalRender, add, remove } = buildPortal({
  hostName: 'default',
  eventEmitter,
  // eslint-disable-next-line react/display-name
  renderManagerView: (children) => <div>{children}</div>,
});

export { PortalHost, PortalRender, add as PortalAdd, remove as PortalRemove };
