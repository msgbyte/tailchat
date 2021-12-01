import { ChatMessage, useUsernames } from 'tailchat-shared';
import _groupBy from 'lodash/groupBy';
import _uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { Emoji } from '@/components/Emoji';
import React from 'react';
import { Tooltip } from 'antd';

interface GroupedReaction {
  name: string;
  length: number;
  users: string[];
}

/**
 * 消息反应的用户名
 */
const ReactionItem: React.FC<{ reaction: GroupedReaction }> = React.memo(
  (props) => {
    const { reaction } = props;

    return (
      <div className="py-0.5 px-1 bg-black bg-opacity-20 rounded flex">
        <Tooltip title={useUsernames(reaction.users)}>
          <div>
            <Emoji emoji={reaction.name} />

            {reaction.length > 1 && <span>{reaction.length}</span>}
          </div>
        </Tooltip>
      </div>
    );
  }
);
ReactionItem.displayName = 'ReactionItem';

/**
 * 消息反应表情渲染
 */
export function useMessageReactions(payload: ChatMessage) {
  const reactions = payload.reactions ?? [];

  const groupedReactions: GroupedReaction[] = useMemo(() => {
    const groups = _groupBy(reactions, 'name');

    return Object.keys(groups).map((name) => {
      const reactions = _uniqBy(groups[name], 'author');
      return {
        name,
        length: reactions.length,
        users: reactions.map((r) => r.author),
      };
    });
  }, [reactions]);

  return (
    <div className="flex chat-message-reactions gap-1 py-0.5">
      {groupedReactions.map((reaction) => (
        <ReactionItem key={reaction.name} reaction={reaction} />
      ))}
    </div>
  );
}
