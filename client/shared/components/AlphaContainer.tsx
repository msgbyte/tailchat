import React, { PropsWithChildren } from 'react';
import { useAlphaMode } from '../hooks/useAlphaMode';

/**
 * Alpha 容器
 * 在 alpha 模式下可以看到一些可以被公开但是还在测试中的功能
 */
export const AlphaContainer: React.FC<PropsWithChildren> = React.memo(
  (props) => {
    const { isAlphaMode } = useAlphaMode();

    return isAlphaMode ? <>{props.children}</> : null;
  }
);
AlphaContainer.displayName = 'AlphaContainer';
