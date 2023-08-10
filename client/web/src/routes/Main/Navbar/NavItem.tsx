import { Tooltip, Badge, BadgeProps } from 'antd';
import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useEvent } from 'tailchat-shared';

export const NavbarNavItem: React.FC<
  PropsWithChildren<{
    name: string;
    className?: ClassValue;
    to?: string;
    showPill?: boolean;
    badge?: boolean;
    badgeProps?: BadgeProps;
    onClick?: () => void;
    ['data-testid']?: string;
  }>
> = React.memo((props) => {
  const { name, className, to, showPill = false, badge = false } = props;
  const location = useLocation();
  const isActive = typeof to === 'string' && location.pathname.startsWith(to);
  const navigate = useNavigate();

  const handleClick = useEvent(() => {
    if (typeof to === 'string') {
      navigate(to);
    }
    props.onClick?.();
  });

  let inner = (
    <Tooltip
      title={
        name ? <div className="font-bold px-1.5 py-0.5">{name}</div> : null
      }
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
        onClick={handleClick}
        data-testid={props['data-testid']}
      >
        {props.children}
      </div>
    </Tooltip>
  );

  if (badge === true) {
    inner = (
      <Badge status="error" dot={true} offset={[0, 44]} {...props.badgeProps}>
        {inner}
      </Badge>
    );
  }

  return (
    <div className="px-3 relative group">
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
    </div>
  );
});
NavbarNavItem.displayName = 'NavbarNavItem';
