import { measure } from '@/utils/measure-helper';
import React, { useMemo } from 'react';

export const SettingsPerformance: React.FC = React.memo(() => {
  const { record, timeUsage } = useMemo(
    () => ({
      record: measure.getRecord(),
      timeUsage: measure.getTimeUsage(),
    }),
    []
  );

  return (
    <div>
      <div className="mb-4">
        <div>Record:</div>
        <div className="rounded bg-black bg-opacity-10 p-2">
          {Object.entries(record).map(([n, t]) => (
            <div key={n}>
              {n}: {t}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>TimeUsage:</div>
        <div className="rounded bg-black bg-opacity-10 p-2">
          {Object.entries(timeUsage).map(([n, t]) => (
            <div key={n}>
              {n}: {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
SettingsPerformance.displayName = 'SettingsPerformance';
