import { Button, ButtonProps, Tooltip } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { isValidStr } from 'tailchat-shared';
import { Icon } from 'tailchat-design';

type IconBtnShapeType = 'circle' | 'square';

function calcShape(
  inputShape: IconBtnShapeType = 'circle'
): ButtonProps['shape'] {
  if (inputShape === 'circle') {
    return 'circle';
  }

  return 'default';
}

interface IconBtnProps extends Omit<ButtonProps, 'shape'> {
  icon: string;
  iconClassName?: string;
  shape?: IconBtnShapeType;
  title?: string;
}
export const IconBtn: React.FC<IconBtnProps> = React.memo(
  ({ icon, iconClassName, title, className, ...props }) => {
    const shape = calcShape(props.shape);

    const iconEl = (
      <span className="anticon">
        <Icon className={iconClassName} icon={icon} />
      </span>
    );

    const btnEl = (
      <Button
        className={clsx(
          'border-0 text-white text-opacity-80 hover:text-opacity-100',
          props.danger
            ? 'bg-red-600 bg-opacity-80 hover:bg-opacity-100'
            : 'bg-black bg-opacity-20 hover:bg-opacity-60',
          className
        )}
        {...props}
        shape={shape}
        icon={iconEl}
      />
    );

    if (isValidStr(title)) {
      return <Tooltip title={title}>{btnEl}</Tooltip>;
    } else {
      return btnEl;
    }
  }
);
IconBtn.displayName = 'IconBtn';
