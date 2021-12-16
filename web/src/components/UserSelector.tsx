import { Select } from 'antd';
import React, { useCallback } from 'react';
import { t } from 'tailchat-shared';
import { useUserInfoList } from 'tailchat-shared/hooks/model/useUserInfoList';

interface UserSelectorProps {
  allUserIds: string[];
  userIds?: string[];
  onChange?: (userIds: string[]) => void;
}
export const UserSelector: React.FC<UserSelectorProps> = React.memo((props) => {
  const { allUserIds, userIds, onChange } = props;
  const userInfoList = useUserInfoList(allUserIds);

  const handleChange = useCallback(
    (userIds: string[]) => {
      typeof onChange === 'function' && onChange(userIds);
    },
    [onChange]
  );

  return (
    <Select
      mode="multiple"
      allowClear={true}
      placeholder={t('请选择用户')}
      value={userIds}
      onChange={handleChange}
    >
      {userInfoList.map((info) => (
        <Select.Option key={info._id} value={info._id}>
          {info.nickname}
        </Select.Option>
      ))}
    </Select>
  );
});
UserSelector.displayName = 'UserSelector';
