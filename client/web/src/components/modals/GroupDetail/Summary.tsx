import { AvatarUploader } from '@/components/ImageUploader';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
  FullModalFieldEditorRenderComponent,
} from '@/components/FullModal/Field';
import { NoData } from '@/components/NoData';
import { Input } from 'antd';
import React from 'react';
import { Avatar } from 'tailchat-design';
import {
  modifyGroupField,
  showSuccessToasts,
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
      showSuccessToasts(t('修改群组名成功'));
    },
    [groupId]
  );

  const [, handleUpdateGroupDescription] = useAsyncRequest(
    async (newName: string) => {
      await modifyGroupField(groupId, 'description', newName);
      showSuccessToasts(t('修改群组描述成功'));
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

      <div className="flex flex-wrap">
        <div className="w-1/3 mobile:w-full mobile:text-center">
          <AvatarUploader
            circle={true}
            onUploadSuccess={handleGroupAvatarChange}
          >
            <Avatar size={128} name={groupInfo.name} src={groupInfo.avatar} />
          </AvatarUploader>
        </div>

        <div className="w-2/3 mobile:w-full">
          <FullModalField
            title={t('群组名称')}
            value={groupInfo.name}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={handleUpdateGroupName}
          />

          <FullModalField
            title={t('成员数')}
            value={String(groupInfo.members.length)}
          />

          <FullModalField
            title={t('群组描述')}
            value={groupInfo.description ?? ''}
            content={<pre>{groupInfo.description ?? ''}</pre>}
            editable={true}
            renderEditor={GroupDescriptionEditorRender}
            onSave={handleUpdateGroupDescription}
          />
        </div>
      </div>
    </div>
  );
});
GroupSummary.displayName = 'GroupSummary';

const GroupDescriptionEditorRender: FullModalFieldEditorRenderComponent = ({
  value,
  onChange,
}) => (
  <Input.TextArea
    autoSize={{ minRows: 4, maxRows: 6 }}
    maxLength={120}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    showCount={true}
  />
);
