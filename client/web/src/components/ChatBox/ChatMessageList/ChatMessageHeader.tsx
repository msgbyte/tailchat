import React from 'react';
import { Icon } from 'tailchat-design';
import { t } from 'tailchat-shared';

export const ChatMessageHeader: React.FC<{
  title: React.ReactNode;
}> = React.memo((props) => {
  return (
    <div className="px-5 pb-4">
      <div className="font-extrabold mb-2 text-2xl flex items-center space-x-1">
        <Icon icon="mdi:pound" />
        <div>{props.title}</div>
      </div>
      <div className="text-base opacity-80">
        {t('这里是所有消息的开始，请畅所欲言。')}
      </div>
    </div>
  );
});
ChatMessageHeader.displayName = 'ChatMessageHeader';
