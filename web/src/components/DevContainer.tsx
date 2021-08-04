import React, { Fragment } from 'react';
import { isDevelopment } from 'tailchat-shared';

export const DevContainer: React.FC = React.memo((props) => {
  return isDevelopment ? <Fragment>{props.children}</Fragment> : null;
});
DevContainer.displayName = 'DevContainer';

export default DevContainer;
