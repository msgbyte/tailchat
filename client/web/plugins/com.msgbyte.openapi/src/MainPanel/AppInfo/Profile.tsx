import { useOpenAppInfo } from '../context';
import React from 'react';
import {
  FullModalField,
  Divider,
  SensitiveText,
  Button,
  Avatar,
} from '@capital/component';
import { Translate } from '../../translate';
import { useOpenAppAction } from './useOpenAppAction';
import styled from 'styled-components';
import './Profile.less';

const TwoColumnContainer = styled.div`
  display: flex;

  > div {
    flex: 1;
  }
`;

/**
 * 基础信息
 */
const Profile: React.FC = React.memo(() => {
  const { appId, appSecret, appName, appDesc, appIcon } = useOpenAppInfo();

  const { handleDeleteApp } = useOpenAppAction();

  return (
    <div className="plugin-openapi-app-info_profile">
      <h2>{Translate.app.basicInfo}</h2>

      <TwoColumnContainer>
        <div>
          <FullModalField title={Translate.app.appName} content={appName} />

          <FullModalField title={Translate.app.appDesc} content={appDesc} />
        </div>

        <div>
          <Avatar name={appName} src={appIcon} size={72} />
        </div>
      </TwoColumnContainer>

      <Divider />

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
