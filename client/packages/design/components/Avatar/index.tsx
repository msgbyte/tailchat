import React, { useMemo } from 'react';
import { Avatar as AntdAvatar, Badge } from 'antd';
import _head from 'lodash/head';
import _upperCase from 'lodash/upperCase';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import _isNumber from 'lodash/isNumber';
import _omit from 'lodash/omit';
import type { AvatarProps as AntdAvatarProps } from 'antd/lib/avatar';
import { getTextColorHex } from './utils';
import { isValidStr } from '../utils';

export { getTextColorHex };

export interface AvatarProps extends AntdAvatarProps {
  name?: string;
  isOnline?: boolean;
}
export const Avatar: React.FC<AvatarProps> = React.memo((_props) => {
  const { isOnline, ...props } = _props;
  const src = isValidStr(props.src) ? props.src : undefined;

  const name = useMemo(() => _upperCase(_head(props.name)), [props.name]);

  const color = useMemo(
    () =>
      // 如果src为空 且 icon为空 则给个固定颜色
      _isEmpty(src) && _isNil(props.icon)
        ? getTextColorHex(props.name)
        : undefined,
    [src, props.icon, props.name]
  );

  const style: React.CSSProperties = useMemo(
    () => ({
      userSelect: 'none',
      ...props.style,
      backgroundColor: color,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    [props.style, color]
  );

  if (_isNumber(props.size)) {
    // 为了支持rem统一管理宽度，将size转换为样式宽度(size类型上不支持rem单位)
    style.width = props.size * (1 / 16) + 'rem';
    style.height = props.size * (1 / 16) + 'rem';

    if (typeof style.fontSize === 'undefined') {
      // 如果props.size是数字且没有指定文字大小
      // 则自动增加fontSize大小
      style.fontSize = props.size * 0.4 * (1 / 16) + 'rem';
    }
  }

  const inner = (
    <AntdAvatar {..._omit(props, ['size'])} src={src} style={style}>
      {name}
    </AntdAvatar>
  );

  if (typeof isOnline === 'boolean') {
    const style = {
      bottom: 0,
      top: 'auto',
    };

    if (isOnline === true) {
      return (
        <Badge dot={true} color="green" style={style}>
          {inner}
        </Badge>
      );
    } else {
      return (
        <Badge dot={true} color="#999" style={style}>
          {inner}
        </Badge>
      );
    }
  }

  return inner;
});
Avatar.displayName = 'Avatar';
