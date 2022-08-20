import { Button } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { createDMConverse, t, useAsyncRequest } from 'tailchat-shared';
import { FriendPicker } from '../UserPicker/FriendPicker';
import { closeModal, ModalWrapper } from '../Modal';

interface CreateDMConverseProps {
  /**
   * 隐藏成员
   * 在选择好友时会进行过滤
   * 但是创建时会加上
   */
  hiddenUserIds?: string[];
}
export const CreateDMConverse: React.FC<CreateDMConverseProps> = React.memo(
  (props) => {
    const { hiddenUserIds = [] } = props;
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
    const history = useHistory();

    const [{ loading }, handleCreate] = useAsyncRequest(async () => {
      const converse = await createDMConverse([
        ...hiddenUserIds,
        ...selectedFriendIds,
      ]);
      closeModal();
      history.push(`/main/personal/converse/${converse._id}`);
    }, [selectedFriendIds]);

    return (
      <ModalWrapper title={t('创建多人会话')}>
        <FriendPicker
          withoutUserIds={hiddenUserIds}
          selectedIds={selectedFriendIds}
          onChange={setSelectedFriendIds}
        />

        <div className="text-right">
          <Button type="primary" loading={loading} onClick={handleCreate}>
            {t('创建')}
          </Button>
        </div>
      </ModalWrapper>
    );
  }
);
CreateDMConverse.displayName = 'CreateDMConverse';
