import { Checkbox, Input } from 'antd';
import React, { useCallback, useState } from 'react';
import { t, useUserInfoList } from 'tailchat-shared';
import _take from 'lodash/take';
import _without from 'lodash/without';
import { Avatar } from 'tailchat-design';
import { NotFound } from '../NotFound';

/**
 * 用户选择器
 */

interface UserPickerProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;

  /**
   * 是否包含搜索框
   * 默认为 true
   */
  withSearch?: boolean;

  /**
   * 所有用户的id列表
   */
  allUserIds: string[];
}
export const UserPicker: React.FC<UserPickerProps> = React.memo((props) => {
  const { withSearch = true, selectedIds, onChange, allUserIds } = props;
  const [searchValue, setSearchValue] = useState('');
  const userInfoList = useUserInfoList(allUserIds);

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

  const matchedList = _take(
    userInfoList.filter((info) => info.nickname.includes(searchValue)),
    10
  );

  return (
    <div>
      {withSearch && (
        <Input
          placeholder={t('搜索用户')}
          className="mb-2"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      )}

      <div>
        {t('已选择 {{num}} 项', {
          num: selectedIds.length,
        })}
      </div>

      {matchedList.length > 0 ? (
        matchedList.map((info) => {
          return (
            <div key={info._id} className="my-1">
              <Checkbox
                className="mr-2 items-center"
                checked={selectedIds.includes(info._id)}
                onChange={(e) => handleSelectUser(info._id, e.target.checked)}
              >
                <div className="flex items-center w-full">
                  <Avatar size="small" name={info.nickname} src={info.avatar} />

                  <div className="ml-1 text-typography-light dark:text-typography-dark">
                    {info.nickname}
                  </div>
                </div>
              </Checkbox>
            </div>
          );
        })
      ) : (
        <NotFound />
      )}
    </div>
  );
});
UserPicker.displayName = 'UserPicker';
