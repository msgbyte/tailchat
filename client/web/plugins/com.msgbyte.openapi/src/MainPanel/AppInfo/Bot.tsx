import React from 'react';
import { FullModalField, Switch } from '@capital/component';
import { useOpenAppInfo } from '../context';
import { OpenAppCapability } from '../types';
import { postRequest, useAsyncFn } from '@capital/common';

const Bot: React.FC = React.memo(() => {
  const { refresh, appId, capability } = useOpenAppInfo();

  const [{ loading }, handleChangeBotCapability] = useAsyncFn(
    async (checked: boolean) => {
      const newCapability: OpenAppCapability[] = [...capability];
      const findIndex = newCapability.findIndex((c) => c === 'bot');

      if (checked) {
        if (findIndex === -1) {
          newCapability.push('bot');
        }
      } else {
        if (findIndex !== -1) {
          newCapability.splice(findIndex, 1);
        }
      }

      await postRequest('/openapi/app/setAppCapability', {
        appId,
        capability: newCapability,
      });
      await refresh();
    },
    [appId, capability, refresh]
  );

  return (
    <div className="plugin-openapi-app-info_bot">
      <FullModalField
        title="开启机器人能力"
        content={
          <Switch
            disabled={loading}
            checked={capability.includes('bot')}
            onChange={handleChangeBotCapability}
          />
        }
      />
    </div>
  );
});
Bot.displayName = 'Bot';

export default Bot;
