import { getMessageRender } from '@capital/common';
import { UserAvatar, UserName } from '@capital/component';
import React from 'react';
import styled from 'styled-components';
import type { GroupTopicComment } from '../types';

const Root = styled.div`
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.05);

  .dark & {
    background-color: rgba(0, 0, 0, 0.25);
  }

  .comment-item {
    display: flex;
    margin-bottom: 10px;

    .left {
      margin-right: 4px;
    }

    .right {
      .username {
        font-weight: bold;
        line-height: 24px;
      }
    }
  }
`;

/**
 * 话题评论
 */
export const TopicComments: React.FC<{
  comments: GroupTopicComment[];
}> = React.memo((props) => {
  return (
    <Root>
      {props.comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="left">
            <UserAvatar userId={comment.author} size={24} />
          </div>

          <div className="right">
            <div className="username">
              <UserName userId={comment.author} />
            </div>
            <div>{getMessageRender(comment.content)}</div>
          </div>
        </div>
      ))}
    </Root>
  );
});
TopicComments.displayName = 'TopicComments';
