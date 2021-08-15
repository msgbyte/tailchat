import { Avatar } from '@/components/Avatar';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModalField';
import { NoData } from '@/components/NoData';
import React from 'react';
import {
  modifyGroupField,
  t,
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
    },
    [groupId]
  );

  if (!groupInfo) {
    return <NoData message={t('无法获取到群组信息')} />;
  }

  return (
    <div className="flex">
      <div className="w-1/2">
        <Avatar size={128} name={groupInfo.name} src={groupInfo.avatar} />
      </div>

      <div className="w-1/2">
        <FullModalField
          title={t('群组名')}
          value={groupInfo.name}
          editable={true}
          renderEditor={DefaultFullModalInputEditorRender}
          onSave={handleUpdateGroupName}
        />
      </div>
    </div>
  );
});
GroupSummary.displayName = 'GroupSummary';
