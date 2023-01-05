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
  active?: boolean;
}
export const IconBtn: React.FC<IconBtnProps> = React.memo(
  ({ icon, iconClassName, title, className, ...props }) => {
    const shape = calcShape(props.shape);

    const iconEl = (
      <span className="anticon">
        <Icon className={iconClassName} icon={icon} />
      </span>
    );

    // 默认情况下的背景颜色
    const normalBg = props.active
      ? 'bg-black bg-opacity-60'
      : 'bg-black bg-opacity-20 hover:bg-opacity-60';

    const btnEl = (
      <Button
        className={clsx(
          'border-0 text-white text-opacity-80 hover:text-opacity-100',
          props.danger
            ? 'bg-red-600 bg-opacity-80 hover:bg-opacity-100'
            : normalBg,
          className
        )}
        {...props}
        shape={shape}
        icon={iconEl}
      />
    );

    if (isValidStr(title) && !props.disabled) {
      // 这里判断 props.disabled 是因为在禁用场景下显示title会有className无法带到Button组件上导致样式错误的问题(背景色溢出形状)
      return <Tooltip title={title}>{btnEl}</Tooltip>;
    } else {
      return btnEl;
    }
  }
);
IconBtn.displayName = 'IconBtn';
