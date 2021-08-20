import { Icon } from '@iconify/react';
import React from 'react';
import { useReducer } from 'react';

export const GroupSection: React.FC<{
  header: string;
}> = React.memo((props) => {
  const [isShow, switchShow] = useReducer((v) => !v, true);

  return (
    <div>
      <div
        className="flex items-center cursor-pointer py-1 text-xs"
        onClick={switchShow}
      >
        <Icon
          className="mr-1"
          icon="mdi:chevron-right"
          rotate={isShow ? 45 : 0}
        />
        <div>{props.header}</div>
      </div>
      <div
        className="transition-all overflow-hidden space-y-0.5 pl-2 ml-1 border-l-4 border-opacity-40"
        style={{
          maxHeight: isShow ? 'var(--max-height)' : 0,
        }}
        ref={(ref) =>
          ref?.style.setProperty('--max-height', `${ref.scrollHeight}px`)
        }
      >
        {props.children}
      </div>
    </div>
  );
});
GroupSection.displayName = 'GroupSection';
