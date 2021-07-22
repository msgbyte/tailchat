import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import React from 'react';

export const NavbarNavItem: React.FC<{
  className?: ClassValue;
  onClick?: () => void;
}> = React.memo((props) => {
  return (
    <div
      className={clsx(
        'w-12 h-12 hover:rounded-lg bg-gray-300 transition-all rounded-1/2 cursor-pointer flex items-center justify-center overflow-hidden',
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
});
NavbarNavItem.displayName = 'NavbarNavItem';
