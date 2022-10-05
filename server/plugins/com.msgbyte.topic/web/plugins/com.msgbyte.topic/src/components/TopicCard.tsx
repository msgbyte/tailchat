import React from 'react';
import { Avatar, IconBtn } from '@capital/component';
import styled from 'styled-components';

const Root = styled.div`
  background-color: rgba(0, 0, 0, 0.25);
  padding: 10px;
  border-radius: 3px;
  margin: 10px;
  width: auto;
  display: flex;

  .left {
    margin-right: 10px;
  }

  .right {
    flex: 1;
    user-select: text;

    .header {
      display: flex;
      line-height: 32px;

      .name {
        margin-right: 4px;
      }

      .date {
        opacity: 0.6;
      }
    }

    .body {
      .content {
        margin-top: 6px;
        margin-bottom: 6px;
      }

      .reply {
        padding: 10px;
        margin-bottom: 6px;
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.25);
      }
    }
  }
`;

export const TopicCard: React.FC = React.memo(() => {
  return (
    <Root>
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
          <IconBtn title="回复" icon="mdi:message-reply-text-outline" />
        </div>
      </div>
    </Root>
  );
});
TopicCard.displayName = 'TopicCard';
