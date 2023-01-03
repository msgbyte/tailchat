import React from 'react';
import {
  model,
  showSuccessToasts,
  t,
  useAsyncRequest,
  useGroupInfo,
} from 'tailchat-shared';
import { Loading } from '@/components/Loading';
import { FullModalField } from '@/components/FullModal/Field';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import { Switch } from 'antd';

export const GroupConfig: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);

  const [{ loading }, handleModifyConfig] = useAsyncRequest(
    async (configName: model.group.GroupConfigNames, configValue: any) => {
      await model.group.modifyGroupConfig(groupId, configName, configValue);
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
    </div>
  );
});
GroupConfig.displayName = 'GroupConfig';
