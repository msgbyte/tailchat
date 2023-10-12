import React, { useEffect, useRef, useState } from 'react';
import { Translate } from './translate';

interface ElectronWebviewProps {
  className?: string;
  src: string;
}
export const ElectronWebview: React.FC<ElectronWebviewProps> = React.memo(
  (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisiable, setIsVisiable] = useState(true);
    const key = props.src;
    const url = props.src;

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();

      (window as any).electron.ipcRenderer.sendMessage('$mount-webview', {
        key,
        url,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      });

      return () => {
        (window as any).electron.ipcRenderer.sendMessage('$unmount-webview', {
          key,
        });
      };
    }, [key, url]);

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry: any) => {
            if (entry.isVisible === true) {
              // 完全可见，显示
              (window as any).electron.ipcRenderer.sendMessage(
                '$show-webview',
                {
                  key: key,
                }
              );
            } else {
              (window as any).electron.ipcRenderer.sendMessage(
                '$hide-webview',
                {
                  key: key,
                }
              );
            }
            setIsVisiable(entry.isVisible);
          });
        },
        {
          trackVisibility: true,
          delay: 200,
        } as any
      );

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { target } = entry;
          if (!target.parentElement) {
            return;
          }

          const rect = target.getBoundingClientRect();

          (window as any).electron.ipcRenderer.sendMessage(
            '$update-webview-rect',
            {
              key: key,
              rect: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
              },
            }
          );
        });
      });

      intersectionObserver.observe(containerRef.current);
      resizeObserver.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          intersectionObserver.unobserve(containerRef.current);
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }, [key]);

    return (
      <div
        ref={containerRef}
        className={props.className}
        style={{ width: '100%', height: '100%' }}
      >
        {isVisiable === false && (
          <span>{Translate.nativeWebviewRenderHideTip}</span>
        )}
      </div>
    );
  }
);
ElectronWebview.displayName = 'ElectronWebview';
