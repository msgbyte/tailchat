import { Badge, Typography } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export const GroupPanelItem: React.FC<{
  name: string;
  icon: React.ReactNode;
  to: string;
  badge?: boolean;
}> = React.memo((props) => {
  const { icon, name, to, badge } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link className="block" to={to}>
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
