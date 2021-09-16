import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Typography, Badge } from 'antd';
import { Avatar } from '@/components/Avatar';
import clsx from 'clsx';

interface SidebarItemProps {
  name: string;
  to: string;
  badge?: boolean | number;
  icon?: string | React.ReactElement;
  action?: React.ReactNode;
}
export const SidebarItem: React.FC<SidebarItemProps> = React.memo((props) => {
  const { icon, name, to, badge } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link to={to}>
      <div
        className={clsx(
          'w-full hover:bg-white hover:bg-opacity-20 cursor-pointer text-gray-900 dark:text-white rounded px-2 h-11 flex items-center text-base group mb-0.5',
          {
            'bg-white bg-opacity-20': isActive,
          }
        )}
      >
        <div className="flex h-8 items-center justify-center text-2xl w-8 mr-3">
          {React.isValidElement(icon) ? (
            icon
          ) : (
            <Avatar src={icon} name={name} />
          )}
        </div>

        <Typography.Text
          className="flex-1 text-gray-900 dark:text-white"
          ellipsis={true}
        >
          {name}
        </Typography.Text>

        {badge === true ? (
          <Badge status="error" />
        ) : (
          <Badge count={Number(badge) || 0} />
        )}

        <div className="text-base p-1 cursor-pointer hidden opacity-70 group-hover:block hover:opacity-100">
          {props.action}
        </div>
      </div>
    </Link>
  );
});
SidebarItem.displayName = 'SidebarItem';
