import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import { IconBtn } from '@/components/IconBtn';
import { UserListItem } from '@/components/UserListItem';
import { useGroupMemberAction } from '@/hooks/useGroupMemberAction';
import { Dropdown, Input, MenuProps } from 'antd';
import React from 'react';
import { Icon } from 'tailchat-design';
import { t, UserBaseInfo } from 'tailchat-shared';
import { Virtuoso } from 'react-virtuoso';

/**
 * 群组成员管理
 */
export const GroupMember: React.FC<{ groupId: string }> = React.memo(
  (props) => {
    const groupId = props.groupId;
    const {
      userInfos,
      searchText,
      setSearchText,
      isSearching,
      searchResult: filteredGroupMembers,
      generateActionMenu,
    } = useGroupMemberAction(groupId);

    const renderUser = (member: UserBaseInfo) => {
      const menu: MenuProps = generateActionMenu(member);

      return (
        <UserListItem
          key={member._id}
          userId={member._id}
          actions={[
            <div key="more">
              <Dropdown menu={menu} trigger={['click']} placement="bottomRight">
                <div>
                  <IconBtn icon="mdi:dots-vertical" />
                </div>
              </Dropdown>
            </div>,
          ]}
        />
      );
    };

    return (
      <div className="flex flex-col h-full">
        <FullModalCommonTitle>{t('成员管理')}</FullModalCommonTitle>

        <div className="py-2">
          <Input
            placeholder={t('搜索成员')}
            size="large"
            suffix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <Virtuoso
            className="h-full"
            data={isSearching ? filteredGroupMembers : userInfos}
            itemContent={(index, item) => renderUser(item)}
          />
        </div>
      </div>
    );
  }
);
GroupMember.displayName = 'GroupMember';
