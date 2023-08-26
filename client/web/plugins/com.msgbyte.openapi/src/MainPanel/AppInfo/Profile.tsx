import { useOpenAppInfo } from '../context';
import React from 'react';
import {
  FullModalField,
  Divider,
  SensitiveText,
  Button,
} from '@capital/component';
import { Translate } from '../../translate';
import { useOpenAppAction } from './useOpenAppAction';
import './Profile.less';

/**
 * 基础信息
 */
const Profile: React.FC = React.memo(() => {
  const { appId, appSecret } = useOpenAppInfo();

  const { handleDeleteApp } = useOpenAppAction();

  return (
    <div className="plugin-openapi-app-info_profile">
      <h2>{Translate.app.appcret}</h2>

      <div>
        <FullModalField title="App ID" content={appId} />
        <FullModalField
          title="App Secret"
          content={<SensitiveText text={appSecret} />}
        />
      </div>

      <Divider />

      <Button type="primary" danger={true} onClick={handleDeleteApp}>
        {Translate.delete}
      </Button>
    </div>
  );
});
Profile.displayName = 'Profile';

export default Profile;
