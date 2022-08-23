import { Button } from 'antd';
import React, { useState } from 'react';
import { appendDMConverseMembers, t, useAsyncFn } from 'tailchat-shared';
import { FriendPicker } from '../UserPicker/FriendPicker';
import { closeModal, ModalWrapper } from '../Modal';

interface AppendDMConverseMembersProps {
  converseId: string;
  /**
   * 排除的用户id
   * 在选择好友时会进行过滤
   */
  withoutUserIds?: string[];
}
export const AppendDMConverseMembers: React.FC<AppendDMConverseMembersProps> =
  React.memo((props) => {
    const { converseId, withoutUserIds = [] } = props;
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

    const [{ loading }, handleConfirm] = useAsyncFn(async () => {
      await appendDMConverseMembers(converseId, [...selectedFriendIds]);
      closeModal();
    }, [converseId, selectedFriendIds]);

    return (
      <ModalWrapper title={t('邀请好友加入会话')}>
        <FriendPicker
          withoutUserIds={withoutUserIds}
          selectedIds={selectedFriendIds}
          onChange={setSelectedFriendIds}
        />

        <div className="text-right">
          <Button type="primary" loading={loading} onClick={handleConfirm}>
            {t('确认')}
          </Button>
        </div>
      </ModalWrapper>
    );
  });
AppendDMConverseMembers.displayName = 'AppendDMConverseMembers';
