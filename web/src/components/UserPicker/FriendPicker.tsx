import React from 'react';
import { useAppSelector } from 'tailchat-shared';
import { UserPicker } from './UserPicker';

interface FriendPickerProps {
  /**
   * 排除的用户id
   * 在选择好友时会进行过滤
   */
  withoutUserIds?: string[];

  /**
   * 是否包含搜索框
   * 默认为 true
   */
  withSearch?: boolean;

  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}
export const FriendPicker: React.FC<FriendPickerProps> = React.memo((props) => {
  const { withoutUserIds = [], selectedIds, onChange } = props;
  const friendIds = useAppSelector((state) =>
    state.user.friends.filter((id) => !withoutUserIds.includes(id))
  );

  return (
    <UserPicker
      selectedIds={selectedIds}
      onChange={onChange}
      allUserIds={friendIds}
    />
  );
});
FriendPicker.displayName = 'FriendPicker';
