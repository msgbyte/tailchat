import React from 'react';

interface WebviewProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 网页渲染容器
 */
export const Webview: React.FC<WebviewProps> = React.memo((props) => {
  return (
    <iframe className={props.className} style={props.style} src={props.url} />
  );
});
Webview.displayName = 'Webview';
