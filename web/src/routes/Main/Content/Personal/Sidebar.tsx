import React from 'react';
import { Icon } from '@iconify/react';
import { SidebarItem } from '../SidebarItem';
import { t, useDMConverseList, useUserInfo } from 'tailchat-shared';
import { SidebarDMItem } from './SidebarDMItem';
import { openModal } from '@/components/Modal';
import { CreateDMConverse } from '@/components/modals/CreateDMConverse';
import DevContainer from '@/components/DevContainer';
import { SectionHeader } from '@/components/SectionHeader';

const SidebarSection: React.FC<{
  action: React.ReactNode;
}> = React.memo((props) => {
  return (
    <div className="h-10 text-gray-900 dark:text-white flex pt-4 px-2">
      <span className="flex-1 overflow-hidden overflow-ellipsis text-xs text-gray-700 dark:text-gray-300">
        {props.children}
      </span>
      <div className="text-base opacity-70 hover:opacity-100 cursor-pointer">
        {props.action}
      </div>
    </div>
  );
});
SidebarSection.displayName = 'SidebarSection';

/**
 * 个人面板侧边栏组件
 */
export const PersonalSidebar: React.FC = React.memo(() => {
  const converseList = useDMConverseList();
  const userInfo = useUserInfo();

  return (
    <div>
      <SectionHeader>{userInfo?.nickname}</SectionHeader>

      <div className="p-2">
        <SidebarItem
          name={t('好友')}
          icon={<Icon icon="mdi:account-multiple" />}
          to="/main/personal/friends"
        />
        <SidebarItem
          name={t('插件中心')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/personal/plugins"
        />
        <SidebarSection
          action={
            <DevContainer>
              <Icon
                icon="mdi:plus"
                onClick={() => openModal(<CreateDMConverse />)}
              />
            </DevContainer>
          }
        >
          {t('私信')}
        </SidebarSection>
        {converseList.map((converse) => {
          return <SidebarDMItem key={converse._id} converse={converse} />;
        })}
      </div>
    </div>
  );
});
PersonalSidebar.displayName = 'PersonalSidebar';
