import { UserName } from '@capital/component';
import React from 'react';
import styled from 'styled-components';
import type { GroupTopicComment } from '../types';

const Root = styled.div`
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.25);

  > div {
    display: flex;
  }
`;

export const TopicComments: React.FC<{
  comments: GroupTopicComment[];
}> = React.memo((props) => {
  return (
    <Root>
      {props.comments.map((comment) => (
        <div key={comment.id}>
          <UserName userId={comment.author} />: <div>{comment.content}</div>
        </div>
      ))}
    </Root>
  );
});
TopicComments.displayName = 'TopicComments';
