import { useOpenAppInfo } from '../context';
import React from 'react';
import { FullModalField, Divider, SensitiveText } from '@capital/component';
import { Translate } from '../../translate';
import './Profile.less';

/**
 * 基础信息
 */
const Profile: React.FC = React.memo(() => {
  const { appId, appSecret } = useOpenAppInfo();

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

      {/* <Divider /> */}

      {/* <h2>{Translate.app.basicInfo}</h2> */}

      {/* TODO */}
    </div>
  );
});
Profile.displayName = 'Profile';

export default Profile;
