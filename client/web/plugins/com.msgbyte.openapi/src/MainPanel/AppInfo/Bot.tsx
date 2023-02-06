import React from 'react';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
  Switch,
} from '@capital/component';
import { useOpenAppInfo } from '../context';
import { Translate } from '../../translate';
import { useOpenAppAction } from './useOpenAppAction';

const Bot: React.FC = React.memo(() => {
  const { capability, bot } = useOpenAppInfo();
  const { loading, handleChangeAppCapability, handleUpdateBotInfo } =
    useOpenAppAction();

  return (
    <div className="plugin-openapi-app-info_bot">
      <FullModalField
        title={Translate.enableBotCapability}
        content={
          <Switch
            disabled={loading}
            checked={capability.includes('bot')}
            onChange={(checked) => handleChangeAppCapability('bot', checked)}
          />
        }
      />

      {capability.includes('bot') && (
        <FullModalField
          title={Translate.bot.callback}
          tip={Translate.bot.callbackTip}
          value={bot?.callbackUrl}
          editable={true}
          renderEditor={DefaultFullModalInputEditorRender}
          onSave={(str: string) =>
            handleUpdateBotInfo('callbackUrl', String(str))
          }
        />
      )}
    </div>
  );
});
Bot.displayName = 'Bot';

export default Bot;
