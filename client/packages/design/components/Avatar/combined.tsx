import { Avatar, AvatarProps } from '.';
import React from 'react';
import _take from 'lodash/take';
import { px2rem } from './utils';
import './combined.css';

interface CombinedAvatarProps {
  shape?: 'circle' | 'square';
  size?: number;
  items: Pick<AvatarProps, 'name' | 'src'>[];
}

/**
 * 组装式头像
 */
export const CombinedAvatar: React.FC<CombinedAvatarProps> = React.memo(
  (props) => {
    const { size = 32, shape = 'circle' } = props;
    const items = _take(props.items, 4);

    const length = items.length;
    const getCellStyle = (i: number): React.CSSProperties => {
      if (length === 1) {
        return {};
      }

      if (length === 2) {
        if (i === 0) {
          return {
            width: '50%',
            overflow: 'hidden',
            position: 'absolute',
            left: 0,
          };
        }
        if (i === 1) {
          return {
            width: '50%',
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
          };
        }
      }

      if (length === 3) {
        if (i === 0) {
          return {
            width: '50%',
            overflow: 'hidden',
            position: 'absolute',
            left: 0,
          };
        }
        if (i === 1) {
          return { transform: 'scale(50%)', transformOrigin: '100% 0 0' };
        }
        if (i === 2) {
          return { transform: 'scale(50%)', transformOrigin: '100% 100% 0' };
        }
      }

      if (length === 4) {
        if (i === 0) {
          return { transform: 'scale(50%)', transformOrigin: '0 0 0' };
        }
        if (i === 1) {
          return { transform: 'scale(50%)', transformOrigin: '100% 0 0' };
        }
        if (i === 2) {
          return { transform: 'scale(50%)', transformOrigin: '0 100% 0' };
        }
        if (i === 3) {
          return { transform: 'scale(50%)', transformOrigin: '100% 100% 0' };
        }
      }

      return {};
    };

    return (
      <div
        className={`td-combined-avatar td-combined-avatar-${length}`}
        style={{
          width: px2rem(size),
          height: px2rem(size),
          borderRadius: shape === 'circle' ? '50%' : 3,
        }}
      >
        {items.map((item, i) => (
          <Avatar
            key={i}
            className="td-combined-avatar__item"
            style={getCellStyle(i)}
            size={size}
            {...item}
          />
        ))}
      </div>
    );
  }
);
CombinedAvatar.displayName = 'CombinedAvatar';
