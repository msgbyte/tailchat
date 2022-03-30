import React from 'react';
import {
  FullModalField,
  DefaultFullModalTextAreaEditorRender,
  Switch,
} from '@capital/component';
import { useOpenAppInfo } from '../context';
import { OpenAppCapability } from '../types';
import { postRequest, useAsyncFn } from '@capital/common';

const OAuth: React.FC = React.memo(() => {
  const { refresh, appId, capability, oauth } = useOpenAppInfo();

  const [{ loading }, handleChangeOAuthCapability] = useAsyncFn(
    async (checked: boolean) => {
      const newCapability: OpenAppCapability[] = [...capability];
      const findIndex = newCapability.findIndex((c) => c === 'oauth');
      const isExist = findIndex !== -1;

      if (checked && !isExist) {
        newCapability.push('oauth');
      } else if (!checked && isExist) {
        newCapability.splice(findIndex, 1);
      }

      await postRequest('/openapi/app/setAppCapability', {
        appId,
        capability: newCapability,
      });
      await refresh();
    },
    [appId, capability, refresh]
  );

  const [, handleUpdateOAuthInfo] = useAsyncFn(
    async (name: string, value: any) => {
      await postRequest('/openapi/app/setAppOAuthInfo', {
        appId,
        fieldName: name,
        fieldValue: value,
      });
      await refresh();
    },
    []
  );

  return (
    <div className="plugin-openapi-app-info_oauth">
      <FullModalField
        title="开启 OAuth"
        content={
          <Switch
            disabled={loading}
            checked={capability.includes('oauth')}
            onChange={handleChangeOAuthCapability}
          />
        }
      />

      {capability.includes('oauth') && (
        <FullModalField
          title={'允许的回调地址'}
          tip="多个回调地址单独一行"
          value={(oauth?.redirectUrls ?? []).join(',')}
          editable={true}
          renderEditor={DefaultFullModalTextAreaEditorRender}
          onSave={(str: string) =>
            handleUpdateOAuthInfo(
              'redirectUrls',
              String(str)
                .split('\n')
                .map((t) => t.trim())
            )
          }
        />
      )}
    </div>
  );
});
OAuth.displayName = 'OAuth';

export default OAuth;
