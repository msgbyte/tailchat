import React, { FC } from 'react';
import { useKeepAliveStore } from './store';

export const KeepAliveOverlayHost: FC<React.PropsWithChildren> = (props) => {
  const cachedComponents = useKeepAliveStore((state) => state.cachedComponents);

  return (
    <>
      {props.children}

      <div className="keep-alive-overlay-host">
        {Object.entries(cachedComponents).map(([cacheId, cacheItem]) => {
          const { visible, element, rect } = cacheItem;

          return (
            <div
              id={`cache-${cacheId}`}
              style={{
                display: visible ? 'block' : 'none',
                ...rect,
                position: 'fixed',
              }}
              key={cacheId}
            >
              {element}
            </div>
          );
        })}
      </div>
    </>
  );
};
KeepAliveOverlayHost.displayName = 'KeepAliveOverlayHost';
