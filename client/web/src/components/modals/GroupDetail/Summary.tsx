import { AvatarUploader } from '@/components/AvatarUploader';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import { NoData } from '@/components/NoData';
import React from 'react';
import { Avatar } from 'tailchat-design';
import {
  modifyGroupField,
  showToasts,
  t,
  UploadFileResult,
  useAsyncRequest,
  useGroupInfo,
} from 'tailchat-shared';

export const GroupSummary: React.FC<{
  groupId: string;
}> = React.memo(({ groupId }) => {
  const groupInfo = useGroupInfo(groupId);

  const [, handleUpdateGroupName] = useAsyncRequest(
    async (newName: string) => {
      await modifyGroupField(groupId, 'name', newName);
      showToasts(t('修改群组名成功'), 'success');
    },
    [groupId]
  );

  const [, handleGroupAvatarChange] = useAsyncRequest(
    async (fileInfo: UploadFileResult) => {
      await modifyGroupField(groupId, 'avatar', fileInfo.url);
      showToasts(t('修改群组头像成功'), 'success');
    },
    [groupId]
  );

  if (!groupInfo) {
    return <NoData message={t('无法获取到群组信息')} />;
  }

  return (
    <div>
      <FullModalCommonTitle>{t('群组概述')}</FullModalCommonTitle>

      <div className="flex">
        <div className="w-1/3">
          <AvatarUploader
            className="text-4xl"
            circle={true}
            onUploadSuccess={handleGroupAvatarChange}
          >
            <Avatar size={128} name={groupInfo.name} src={groupInfo.avatar} />
          </AvatarUploader>
        </div>

        <div className="w-2/3">
          <FullModalField
            title={t('群组名称')}
            value={groupInfo.name}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={handleUpdateGroupName}
          />
        </div>
      </div>
    </div>
  );
});
GroupSummary.displayName = 'GroupSummary';
