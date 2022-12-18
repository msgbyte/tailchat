import React from 'react';
import { withKeepAliveOverlay } from './KeepAliveOverlay';

interface WebviewProps {
  className?: string;
  style?: React.CSSProperties;
  url: string;
}

/**
 * 网页渲染容器
 */
export const Webview: React.FC<WebviewProps> = (props) => {
  return <iframe className="w-full h-full" src={props.url} />;
};
Webview.displayName = 'Webview';

/**
 * 带缓存的网页渲染容器
 * 用于需要在切换时依旧保持加载的case
 */
export const WebviewKeepAlive: React.FC<WebviewProps> =
  withKeepAliveOverlay<WebviewProps>(Webview, {
    cacheId: (props) => props.url,
  });
WebviewKeepAlive.displayName = 'WebviewKeepAlive';
