import React, { useReducer } from 'react';
import { Icon } from '@iconify/react';
import { GroupPanelType, useGroupInfo } from 'tailchat-shared';
import { useLocation, useParams } from 'react-router';
import { Badge, Typography } from 'antd';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { GroupHeader } from './GroupHeader';

interface GroupParams {
  groupId: string;
}

const GroupSection: React.FC<{
  header: string;
}> = React.memo((props) => {
  const [isShow, switchShow] = useReducer((v) => !v, true);

  return (
    <div>
      <div
        className="flex items-center cursor-pointer py-1"
        onClick={switchShow}
      >
        <Icon
          className="mr-1"
          icon="mdi-chevron-right"
          rotate={isShow ? 45 : 0}
        />
        <div>{props.header}</div>
      </div>
      <div
        className="transition-all overflow-hidden"
        style={{
          maxHeight: isShow ? 'var(--max-height)' : 0,
        }}
        ref={(ref) =>
          ref?.style.setProperty('--max-height', `${ref.scrollHeight}px`)
        }
      >
        {props.children}
      </div>
    </div>
  );
});
GroupSection.displayName = 'GroupSection';

const GroupPanelItem: React.FC<{
  name: string;
  icon: React.ReactNode;
  to: string;
  badge?: boolean;
}> = React.memo((props) => {
  const { icon, name, to, badge } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link to={to}>
      <div
        className={clsx(
          'w-full hover:bg-white hover:bg-opacity-20 cursor-pointer text-white rounded px-1 h-8 flex items-center text-base group',
          {
            'bg-white bg-opacity-20': isActive,
          }
        )}
      >
        <div className="flex items-center justify-center px-1 mr-1">{icon}</div>

        <Typography.Text className="flex-1 text-white" ellipsis={true}>
          {name}
        </Typography.Text>

        {badge === true ? (
          <Badge status="error" />
        ) : (
          <Badge count={Number(badge) || 0} />
        )}
      </div>
    </Link>
  );
});
GroupPanelItem.displayName = 'GroupPanelItem';

/**
 * 个人面板侧边栏组件
 */
export const Sidebar: React.FC = React.memo(() => {
  const { groupId } = useParams<GroupParams>();
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];

  return (
    <div>
      <GroupHeader groupId={groupId} />

      <div className="p-2">
        {groupPanels
          .filter((panel) => panel.type === GroupPanelType.GROUP)
          .map((group) => (
            <GroupSection key={group.id} header={group.name}>
              {groupPanels
                .filter((panel) => panel.parentId === group.id)
                .map((panel) => (
                  <GroupPanelItem
                    key={panel.id}
                    name={panel.name}
                    icon={<div>#</div>}
                    to={`/main/group/${groupId}/${panel.id}`}
                  />
                ))}
            </GroupSection>
          ))}
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';
