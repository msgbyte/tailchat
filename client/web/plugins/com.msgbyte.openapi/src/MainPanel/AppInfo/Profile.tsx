import { useOpenAppInfo } from '../context';
import React from 'react';
import {
  FullModalField,
  Divider,
  SensitiveText,
  Button,
  Avatar,
  AvatarUploader,
  DefaultFullModalInputEditorRender,
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

  const { handleSetAppInfo, handleDeleteApp } = useOpenAppAction();

  return (
    <div className="plugin-openapi-app-info_profile">
      <h2>{Translate.app.basicInfo}</h2>

      <TwoColumnContainer>
        <div>
          <FullModalField
            title={Translate.app.appName}
            value={appName}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={(val) => handleSetAppInfo('appName', val)}
          />

          <FullModalField
            title={Translate.app.appDesc}
            value={appDesc}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={(val) => handleSetAppInfo('appDesc', val)}
          />
        </div>

        <div>
          <AvatarUploader
            onUploadSuccess={(fileInfo) => {
              handleSetAppInfo('appIcon', fileInfo.url);
            }}
          >
            <Avatar name={appName} src={appIcon} size={72} />
          </AvatarUploader>
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
