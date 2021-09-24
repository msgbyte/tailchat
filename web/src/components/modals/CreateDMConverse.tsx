import { Button } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { createDMConverse, t, useAsyncFn } from 'tailchat-shared';
import { FriendPicker } from '../FriendPicker';
import { closeModal, ModalWrapper } from '../Modal';

interface CreateDMConverseProps {
  /**
   * 排除的用户id
   * 在选择好友时会进行过滤
   */
  withoutUserIds?: string[];
}
export const CreateDMConverse: React.FC<CreateDMConverseProps> = React.memo(
  (props) => {
    const { withoutUserIds = [] } = props;
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
    const history = useHistory();

    const [{ loading }, handleCreate] = useAsyncFn(async () => {
      const converse = await createDMConverse([...selectedFriendIds]);
      closeModal();
      history.push(`/main/personal/converse/${converse._id}`);
    }, [selectedFriendIds]);

    return (
      <ModalWrapper title={t('创建多人会话')}>
        <FriendPicker
          withoutUserIds={withoutUserIds}
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
