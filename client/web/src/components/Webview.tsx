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
export const Webview: React.FC<WebviewProps> =
  withKeepAliveOverlay<WebviewProps>(
    (props) => {
      return <iframe className="w-full h-full bg-white" src={props.url} />;
    },
    { cacheId: (props) => props.url }
  );
Webview.displayName = 'Webview';
