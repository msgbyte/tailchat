import { Checkbox, Input } from 'antd';
import React, { useCallback, useState } from 'react';
import {
  getCachedUserInfo,
  t,
  useAppSelector,
  useAsync,
} from 'tailchat-shared';
import _take from 'lodash/take';
import _without from 'lodash/without';
import { Avatar } from './Avatar';

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
  const {
    withoutUserIds = [],
    withSearch = true,
    selectedIds,
    onChange,
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const friendIds = useAppSelector((state) =>
    state.user.friends.filter((id) => !withoutUserIds.includes(id))
  );

  const { value: friendInfoList = [] } = useAsync(() => {
    return Promise.all(friendIds.map((id) => getCachedUserInfo(id)));
  }, [friendIds.join(',')]);

  const handleSelectUser = useCallback(
    (userId: string, isSelected: boolean) => {
      if (isSelected === true) {
        // 添加
        if (selectedIds.includes(userId)) {
          return;
        }

        typeof onChange === 'function' && onChange([...selectedIds, userId]);
      } else {
        // 移除
        typeof onChange === 'function' &&
          onChange(_without(selectedIds, userId));
      }
    },
    [selectedIds, onChange]
  );

  return (
    <div>
      {withSearch && (
        <Input
          placeholder={t('搜索好友')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      )}

      <div>
        {t('已选择')}: {selectedIds.length}
      </div>

      {_take(
        friendInfoList.filter((info) => info.nickname.includes(searchValue)),
        5
      ).map((info) => {
        return (
          <div key={info._id} className="my-1">
            <Checkbox
              className="mr-2 items-center"
              checked={selectedIds.includes(info._id)}
              onChange={(e) => handleSelectUser(info._id, e.target.checked)}
            >
              <div className="flex items-center">
                <Avatar size="small" name={info.nickname} src={info.avatar} />

                <div className="ml-1 text-white">{info.nickname}</div>
              </div>
            </Checkbox>
          </div>
        );
      })}
    </div>
  );
});
FriendPicker.displayName = 'FriendPicker';
