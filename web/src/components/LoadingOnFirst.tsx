import React, { useMemo, useRef } from 'react';
import { Loading, LoadingProps } from './Loading';

interface LoadingOnFirstProps extends LoadingProps {
  spinning: boolean;
  className?: string;
  style?: React.CSSProperties;
}
/**
 * 类似于 <Loading /> 但是只会触发一次
 */
export const LoadingOnFirst: React.FC<LoadingOnFirstProps> = React.memo(
  (props) => {
    const lockRef = useRef(false);
    const spinning = useMemo(() => {
      if (lockRef.current === true) {
        return false;
      }

      if (props.spinning === true) {
        lockRef.current = true;
      }

      return props.spinning;
    }, [props.spinning]);

    return (
      <Loading {...props} spinning={spinning}>
        {props.children}
      </Loading>
    );
  }
);
LoadingOnFirst.displayName = 'LoadingOnFirst';
