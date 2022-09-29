import React from 'react';
import { Avatar, IconBtn } from '@capital/component';
import './TopicCard.less';

export const TopicCard: React.FC = React.memo(() => {
  return (
    <div className="plugin-topic-card">
      <div className="left">
        <Avatar name="any" />
      </div>

      <div className="right">
        <div className="header">
          <div className="name">用户名</div>
          <div className="date">12:00</div>
        </div>

        <div className="body">
          <div className="content">
            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
          </div>

          <div className="reply">回复回复回复</div>
        </div>

        <div className="footer">
          <IconBtn icon="mdi:message-reply-text-outline" />
        </div>
      </div>
    </div>
  );
});
TopicCard.displayName = 'TopicCard';
