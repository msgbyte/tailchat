import React, { useEffect, useMemo, useRef } from 'react';
import { useKeepAliveStore } from './store';
import _omit from 'lodash/omit';

/**
 * 样式相关配置
 */
interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 注意: 样式相关的字段(className, style)会被单独抽出来, 会应用于占位组件，不会透传到渲染组件中
 * 如果实际渲染组件需要样式自定义的话需要另外换个名字
 */
export function withKeepAliveOverlay<
  P extends StyleProps = StyleProps,
  OP extends Omit<P, 'className' | 'style'> = Omit<P, 'className' | 'style'>
>(
  OriginComponent: React.ComponentType<OP>,
  config: {
    cacheId: string | ((props: OP) => string);
  }
) {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const originProps = _omit(props, ['className', 'style']) as OP;
    const { mount, hide, updateRect } = useKeepAliveStore();
    const cacheId = useMemo(() => {
      if (typeof config.cacheId === 'function') {
        return config.cacheId(originProps);
      }

      return config.cacheId;
    }, [originProps]);

    useEffect(() => {
      mount(cacheId, <OriginComponent key={cacheId} {...originProps} />);

      return () => {
        hide(cacheId);
      };
    }, [cacheId]);

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { target } = entry;
          if (!target.parentElement) {
            return;
          }

          const rect = target.getBoundingClientRect();

          updateRect(cacheId, {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          });
        });
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }, [cacheId]);

    return (
      <div
        id={`withKeepAlive${cacheId}`}
        ref={containerRef}
        className={props.className}
        style={props.style}
      />
    );
  };
}
