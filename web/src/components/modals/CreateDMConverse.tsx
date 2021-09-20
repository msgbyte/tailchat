import { Button } from 'antd';
import React, { useState } from 'react';
import { t } from 'tailchat-shared';
import { FriendPicker } from '../FriendPicker';
import { ModalWrapper } from '../Modal';

interface CreateDMCOnverseProps {
  /**
   * 排除的用户id
   * 在选择好友时会进行过滤
   */
  withoutUserIds?: string[];
}
export const CreateDMCOnverse: React.FC<CreateDMCOnverseProps> = React.memo(
  (props) => {
    const { withoutUserIds = [] } = props;
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

    return (
      <ModalWrapper title={t('创建多人会话')}>
        <FriendPicker
          withoutUserIds={withoutUserIds}
          selectedIds={selectedFriendIds}
          onChange={setSelectedFriendIds}
        />

        <div className="text-right">
          <Button type="primary">{t('创建')}</Button>
        </div>
      </ModalWrapper>
    );
  }
);
CreateDMCOnverse.displayName = 'CreateDMCOnverse';
