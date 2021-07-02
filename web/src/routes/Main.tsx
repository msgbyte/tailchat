import { Icon } from '@iconify/react';
import clsx, { ClassValue } from 'clsx';
import React, { useLayoutEffect } from 'react';

const NavbarNavItem: React.FC<{
  className?: ClassValue;
}> = React.memo((props) => {
  return (
    <div
      className={clsx(
        'w-10 h-10 hover:rounded-lg bg-gray-300 transition-all rounded-1/2 cursor-pointer flex items-center justify-center',
        props.className
      )}
    >
      {props.children}
    </div>
  );
});

export const MainRoute: React.FC = React.memo(() => {
  return (
    <div className="flex h-full">
      <div className="w-16 bg-gray-900 flex flex-col justify-start items-center pt-4 pb-4 p-1">
        {/* Navbar */}
        <div className="flex-1">
          <NavbarNavItem />
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
      <div className="w-56 bg-gray-800 p-2">
        {/* Sidebar */}
        <div className="w-full hover:bg-white hover:bg-opacity-20 cursor-pointer text-white rounded p-2">
          目标
        </div>
      </div>
      <div className="flex-auto bg-gray-700">{/* Main Content */}</div>
    </div>
  );
});
MainRoute.displayName = 'MainRoute';
