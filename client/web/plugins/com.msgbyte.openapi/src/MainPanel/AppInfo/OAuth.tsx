import React from 'react';
import {
  FullModalField,
  DefaultFullModalTextAreaEditorRender,
  Switch,
} from '@capital/component';
import { useOpenAppInfo } from '../context';
import { useOpenAppAction } from './useOpenAppAction';

const OAuth: React.FC = React.memo(() => {
  const { capability, oauth } = useOpenAppInfo();
  const { loading, handleChangeAppCapability, handleUpdateOAuthInfo } =
    useOpenAppAction();

  return (
    <div className="plugin-openapi-app-info_oauth">
      <FullModalField
        title="开启 OAuth"
        content={
          <Switch
            disabled={loading}
            checked={capability.includes('oauth')}
            onChange={(checked) => handleChangeAppCapability('oauth', checked)}
          />
        }
      />

      {capability.includes('oauth') && (
        <FullModalField
          title={'允许的回调地址'}
          tip="多个回调地址单独一行"
          content={
            <>
              {(oauth?.redirectUrls ?? []).map((url, i) => (
                <p key={i}>{url}</p>
              ))}
            </>
          }
          value={(oauth?.redirectUrls ?? []).join('\n')}
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
