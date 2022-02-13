import { Button, ButtonProps, Tooltip } from 'antd';
import React from 'react';
import { isValidStr } from 'tailchat-shared';
import { Icon } from './Icon';

const btnClassName =
  'border-0 bg-black bg-opacity-20 text-white text-opacity-80 hover:text-opacity-100 hover:bg-opacity-60';

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
  ({ icon, iconClassName, title, ...props }) => {
    const shape = calcShape(props.shape);

    const iconEl = (
      <span className="anticon">
        <Icon className={iconClassName} icon={icon} />
      </span>
    );

    const btnEl = (
      <Button className={btnClassName} {...props} shape={shape} icon={iconEl} />
    );

    if (isValidStr(title)) {
      return <Tooltip title={title}>{btnEl}</Tooltip>;
    } else {
      return btnEl;
    }
  }
);
IconBtn.displayName = 'IconBtn';
