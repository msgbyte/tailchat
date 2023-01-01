import React from 'react';
import { Icon } from 'tailchat-design';

interface Props {
  onClick: () => void;
}

/**
 * 滚动到底部的按钮
 */
export const ScrollToBottom: React.FC<Props> = React.memo((props) => {
  return (
    <div
      className="absolute right-6 bottom-18 px-3 py-2 rounded-full bg-white dark:bg-black bg-opacity-50 shadow cursor-pointer z-10 w-11 h-11 flex justify-center items-center text-2xl hover:bg-opacity-80"
      onClick={props.onClick}
    >
      <Icon icon="mdi:chevron-double-down" />
    </div>
  );
});
ScrollToBottom.displayName = 'ScrollToBottom';
