import React, { Fragment, PropsWithChildren } from 'react';
import { isDevelopment } from 'tailchat-shared';

/**
 * 开发中容器
 * 在容器下的组件在生产环境下不会被渲染
 */
export const DevContainer: React.FC<PropsWithChildren> = React.memo((props) => {
  return isDevelopment ? <Fragment>{props.children}</Fragment> : null;
});
DevContainer.displayName = 'DevContainer';
