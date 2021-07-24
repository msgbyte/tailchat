import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export const NavbarNavItem: React.FC<{
  className?: ClassValue;
  to?: string;
  onClick?: () => void;
}> = React.memo((props) => {
  const { className, to } = props;
  const location = useLocation();
  const isActive = typeof to === 'string' && location.pathname.startsWith(to);

  const inner = (
    <div
      className={clsx(
        'w-12 h-12 hover:rounded-lg transition-all cursor-pointer flex items-center justify-center overflow-hidden',
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
  );

  if (typeof to === 'string') {
    return <Link to={to}>{inner}</Link>;
  }

  return inner;
});
NavbarNavItem.displayName = 'NavbarNavItem';
