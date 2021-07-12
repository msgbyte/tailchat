import { Icon } from '@iconify/react';
import { Button, ButtonProps } from 'antd';
import React from 'react';

interface IconBtnProps extends ButtonProps {
  icon: string;
}
export const IconBtn: React.FC<IconBtnProps> = React.memo(
  ({ icon, ...props }) => {
    return (
      <Button
        className="border-0 bg-black bg-opacity-30 text-white text-opacity-80 hover:text-opacity-100 hover:bg-opacity-60"
        shape="circle"
        {...props}
        icon={<Icon className="anticon" icon={icon} />}
      />
    );
  }
);
IconBtn.displayName = 'IconBtn';
