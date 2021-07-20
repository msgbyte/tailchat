import React from 'react';
import { useAppSelector } from 'tailchat-shared';
import { Icon } from '@iconify/react';
import clsx, { ClassValue } from 'clsx';
import { Avatar } from '../../components/Avatar';

const NavbarNavItem: React.FC<{
  className?: ClassValue;
}> = React.memo((props) => {
  return (
    <div
      className={clsx(
        'w-12 h-12 hover:rounded-lg bg-gray-300 transition-all rounded-1/2 cursor-pointer flex items-center justify-center overflow-hidden',
        props.className
      )}
    >
      {props.children}
    </div>
  );
});
NavbarNavItem.displayName = 'NavbarNavItem';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  const userInfo = useAppSelector((state) => state.user.info);

  return (
    <div className="w-18 bg-gray-900 flex flex-col justify-start items-center pt-4 pb-4 p-1">
      {/* Navbar */}
      <div className="flex-1">
        <NavbarNavItem>
          <Avatar
            shape="square"
            size={48}
            name={userInfo?.nickname}
            src={userInfo?.avatar}
          />
        </NavbarNavItem>
        <div className="h-px w-full bg-white mt-4 mb-4"></div>
        <div className="space-y-2">
          <NavbarNavItem />
          <NavbarNavItem />
          <NavbarNavItem />
          <NavbarNavItem />
          <NavbarNavItem className="bg-green-500">
            <Icon className="text-3xl text-white" icon="mdi-plus" />
          </NavbarNavItem>
        </div>
      </div>
      <div>
        <Icon
          className="text-3xl text-white cursor-pointer"
          icon="mdi-dots-horizontal"
        />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
