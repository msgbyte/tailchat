import React, { useMemo } from 'react';
import { Avatar as AntdAvatar } from 'antd';
import _head from 'lodash/head';
import _upperCase from 'lodash/upperCase';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import _isNumber from 'lodash/isNumber';
import type { AvatarProps as AntdAvatarProps } from 'antd/lib/avatar';
import { getTextColorHex } from 'pawchat-shared';

interface AvatarProps extends AntdAvatarProps {
  name?: string;
}
export const Avatar: React.FC<AvatarProps> = React.memo((props) => {
  const src = typeof props.src !== 'string' ? props.src : undefined;

  const name = useMemo(() => _upperCase(_head(props.name)), [props.name]);

  const color = useMemo(
    () =>
      // 如果src为空 且 icon为空 则给个固定颜色
      _isEmpty(src) && _isNil(props.icon)
        ? getTextColorHex(props.name!)
        : undefined,
    [src, props.icon, props.name]
  );

  const style: React.CSSProperties = useMemo(
    () => ({
      cursor: 'inherit',
      userSelect: 'none',
      ...props.style,
      backgroundColor: color,
    }),
    [props.style, color]
  );

  if (_isNumber(props.size) && typeof style.fontSize === 'undefined') {
    // 如果props.size是数字且没有指定文字大小
    // 则自动增加fontSize大小
    style.fontSize = props.size * 0.4;
  }

  return (
    <AntdAvatar {...props} src={src} style={style}>
      {name}
    </AntdAvatar>
  );
});
Avatar.displayName = 'Avatar';
