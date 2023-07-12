import React from 'react';
import {
  model,
  showSuccessToasts,
  t,
  UploadFileResult,
  useAsyncRequest,
  useGroupInfo,
} from 'tailchat-shared';
import { Image } from 'tailchat-design';
import { Loading } from '@/components/Loading';
import { FullModalField } from '@/components/FullModal/Field';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import { Button, Switch } from 'antd';
import { pluginGroupConfigItems } from '@/plugin/common';
import { ensurePluginNamePrefix } from '@/utils/plugin-helper';
import { ImageUploader } from '@/components/ImageUploader';

export const GroupConfig: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);

  const [{ loading }, handleModifyConfig] = useAsyncRequest(
    async (configName: model.group.GroupConfigNames, configValue: any) => {
      await model.group.modifyGroupConfig(groupId, configName, configValue);
      showSuccessToasts();
    },
    [groupId]
  );

  if (!groupInfo) {
    return <Loading spinning={true} />;
  }

  const config = groupInfo.config ?? {};

  return (
    <div>
      <FullModalCommonTitle>{t('群组配置')}</FullModalCommonTitle>

      <FullModalField
        title={t('隐藏成员完整名称')}
        tip={t('群组隐私控制，防止通过群组恶意获取成员信息')}
        content={
          <Switch
            disabled={loading}
            checked={config['hideGroupMemberDiscriminator'] ?? false}
            onChange={(checked) =>
              handleModifyConfig('hideGroupMemberDiscriminator', checked)
            }
          />
        }
      />

      <FullModalField
        title={t('群组背景')}
        tip={t('个性化配置群组背景')}
        content={
          <>
            <ImageUploader
              aspect={16 / 9}
              onUploadSuccess={function (fileInfo: UploadFileResult): void {
                handleModifyConfig('groupBackgroundImage', fileInfo.url);
              }}
            >
              <Image
                wrapperClassName="block"
                style={{ width: 640, height: 360 }}
                src={config['groupBackgroundImage']}
              />
            </ImageUploader>
            <div className="text-xs opacity-80">
              {t('建议比例: 16:9 | 建议大小: 1280x720')}
            </div>

            {config['groupBackgroundImage'] && (
              <Button
                className="mt-1"
                type="primary"
                onClick={() => {
                  handleModifyConfig('groupBackgroundImage', '');
                }}
              >
                {t('清除')}
              </Button>
            )}
          </>
        }
      />

      {pluginGroupConfigItems.map((item) => {
        const name = ensurePluginNamePrefix(item.name);
        return (
          <FullModalField
            key={name}
            title={item.title}
            tip={item.tip}
            content={React.createElement(item.component, {
              value: config[name],
              onChange: (val: any) => handleModifyConfig(name, val),
              loading,
            })}
          />
        );
      })}
    </div>
  );
});
GroupConfig.displayName = 'GroupConfig';
