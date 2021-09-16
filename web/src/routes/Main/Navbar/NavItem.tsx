import { Tooltip, Badge } from 'antd';
import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export const NavbarNavItem: React.FC<{
  name: string;
  className?: ClassValue;
  to?: string;
  showPill?: boolean;
  badge?: boolean;
  onClick?: () => void;
}> = React.memo((props) => {
  const { name, className, to, showPill = false, badge = false } = props;
  const location = useLocation();
  const isActive = typeof to === 'string' && location.pathname.startsWith(to);

  let inner = (
    <Tooltip
      title={<div className="font-bold px-1.5 py-0.5">{name}</div>}
      placement="right"
    >
      <div
        className={clsx(
          'w-12 h-12 hover:rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center overflow-hidden',
          className,
          {
            'rounded-1/2': !isActive,
            'rounded-lg': isActive,
          }
        )}
        onClick={props.onClick}
      >
        {props.children}
      </div>
    </Tooltip>
  );

  if (typeof to === 'string') {
    inner = <Link to={to}>{inner}</Link>;
  }

  return (
    <div className="w-full px-3 relative group">
      {showPill && (
        <div
          className="absolute w-2 left-0 top-0 bottom-0 flex items-center"
          style={{ marginLeft: -4 }}
        >
          <span
            className={clsx(
              'bg-gray-400 dark:bg-white w-2 h-2 rounded transition-all duration-300',
              {
                'h-2 group-hover:h-5': !isActive,
                'h-10': isActive,
              }
            )}
          />
        </div>
      )}
      {inner}

      <div className="absolute right-0 bottom-0">
        {badge === true ? (
          <Badge status="error" />
        ) : (
          <Badge count={Number(badge) || 0} />
        )}
      </div>
    </div>
  );
});
NavbarNavItem.displayName = 'NavbarNavItem';
