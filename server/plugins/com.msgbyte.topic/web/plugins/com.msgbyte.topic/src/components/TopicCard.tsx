import React, { useReducer, useState } from 'react';
import {
  getMessageRender,
  showMessageTime,
  showSuccessToasts,
  useAsyncRequest,
  useCurrentUserInfo,
  useGroupInfo,
} from '@capital/common';
import {
  IconBtn,
  TextArea,
  UserName,
  UserAvatar,
  MessageAckContainer,
} from '@capital/component';
import styled from 'styled-components';
import type { GroupTopic } from '../types';
import { Translate } from '../translate';
import { request } from '../request';
import { TopicComments } from './TopicComments';

const Root = styled.div`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 3px;
  margin: 10px;
  width: auto;
  display: flex;

  .dark & {
    background-color: rgba(0, 0, 0, 0.25);
  }

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
    }

    .footer {
      display: flex;
      gap: 4px;
    }
  }
`;

const ReplyBox = styled.div`
  padding: 10px;
  margin-top: 10px;
  background-color: transparent;

  .dark & {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;

export const TopicCard: React.FC<{
  topic: GroupTopic;
}> = React.memo((props) => {
  const topic: Partial<GroupTopic> = props.topic ?? {};
  const [showReply, toggleShowReply] = useReducer((state) => !state, false);
  const [comment, setComment] = useState('');
  const groupInfo = useGroupInfo(topic.groupId);
  const groupOwnerId = groupInfo?.owner;
  const userId = useCurrentUserInfo()._id;

  const [{ loading }, handleComment] = useAsyncRequest(async () => {
    await request.post('createComment', {
      groupId: topic.groupId,
      panelId: topic.panelId,
      topicId: topic._id,
      content: comment,
    });

    setComment('');
    toggleShowReply();
    showSuccessToasts();
  }, [topic.groupId, topic.panelId, topic._id, comment]);

  const [, handleDeleteTopic] = useAsyncRequest(async () => {
    await request.post('delete', {
      groupId: topic.groupId,
      panelId: topic.panelId,
      topicId: topic._id,
    });
  }, []);

  return (
    <MessageAckContainer converseId={topic.panelId} messageId={topic._id}>
      <Root>
        <div className="left">
          <UserAvatar userId={topic.author} />
        </div>

        <div className="right">
          <div className="header">
            <div className="name">
              <UserName userId={topic.author} />
            </div>
            <div className="date">{showMessageTime(topic.createdAt)}</div>
          </div>

          <div className="body">
            <div className="content">{getMessageRender(topic.content)}</div>

            {Array.isArray(topic.comments) && topic.comments.length > 0 && (
              <TopicComments comments={topic.comments} />
            )}
          </div>

          <div className="footer">
            <IconBtn
              title={Translate.reply}
              icon="mdi:message-reply-text-outline"
              onClick={toggleShowReply}
            />

            {userId === groupOwnerId && (
              <IconBtn
                title={Translate.delete}
                icon="mdi:delete-outline"
                onClick={handleDeleteTopic}
              />
            )}
          </div>

          {showReply && (
            <ReplyBox>
              <TextArea
                autoFocus
                placeholder={Translate.replyThisTopic}
                disabled={loading}
                value={comment}
                row={2}
                maxLength={1000}
                showCount={true}
                onChange={(e) => setComment(e.target.value)}
                onPressEnter={handleComment}
              />
            </ReplyBox>
          )}
        </div>
      </Root>
    </MessageAckContainer>
  );
});
TopicCard.displayName = 'TopicCard';
