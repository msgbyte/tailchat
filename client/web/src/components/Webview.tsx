import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildRegFn, isSafeUrl, t } from 'tailchat-shared';
import { withKeepAliveOverlay } from './KeepAliveOverlay';
import { Loading } from './Loading';

interface WebviewKernelProps {
  className?: string;
  src: string;
}

/**
 * 内置的默认webview渲染容器
 */
const DefaultWebviewKernel: React.FC<WebviewKernelProps> = React.memo(
  (props) => {
    const ref = useRef<HTMLIFrameElement>(null);
    const [spinning, setSpinning] = useState(true);

    useEffect(() => {
      const callback = () => {
        setSpinning(false);
      };
      ref.current?.addEventListener('load', callback);

      return () => {
        ref.current?.removeEventListener('load', callback);
      };
    }, []);

    return (
      <Loading
        spinning={spinning}
        className="w-full h-full"
        tip={t('加载网页中...')}
      >
        <iframe {...props} ref={ref} />
      </Loading>
    );
  }
);
DefaultWebviewKernel.displayName = 'DefaultWebviewKernel';

const [getWebviewKernel, setWebviewKernel, resetWebviewKernel] = buildRegFn<
  () => React.ComponentType<WebviewKernelProps>
>('webviewKernelComponent', () => DefaultWebviewKernel);

export { setWebviewKernel, resetWebviewKernel };

interface WebviewProps {
  className?: string;
  style?: React.CSSProperties;
  url: string;
}

/**
 * 网页渲染容器
 */
export const Webview: React.FC<WebviewProps> = (props) => {
  const KernelComponent = useMemo(() => getWebviewKernel(), []);

  // javascript: 等地址在 iframe 中会以主站身份执行代码, 不允许加载
  const src = isSafeUrl(props.url) ? props.url : 'about:blank';

  return <KernelComponent className="w-full h-full" src={src} />;
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
