import React from 'react';
import { useAsync } from '@capital/common';
import { Divider, Image, Tooltip } from '@capital/component';
import { request } from './request';

export const FimAction: React.FC = React.memo(() => {
  const { loading, value: strategies } = useAsync(async () => {
    const { data: strategies } = await request.get('availableStrategies');

    return strategies;
  }, []);

  if (loading) {
    return null;
  }

  if (Array.isArray(strategies) && strategies.length > 0) {
    return (
      <div>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {strategies.map((s) => (
            <Tooltip key={s.name} title={s.name}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                  borderRadius: 20,
                }}
                src={s.icon}
                onClick={async () => {
                  if (s.type === 'oauth') {
                    const { data: url } = await request.get(
                      `${s.name}.loginUrl`
                    );

                    const win = window.open(url, 'square', 'frame=true');
                    win.addEventListener('message', (...args) => {
                      console.log(...args);
                    });
                  }
                }}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }

  return null;
});
FimAction.displayName = 'FimAction';
