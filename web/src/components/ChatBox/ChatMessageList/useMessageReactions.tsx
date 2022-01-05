import { ChatMessage, removeReaction, useUsernames } from 'tailchat-shared';
import _groupBy from 'lodash/groupBy';
import _uniqBy from 'lodash/uniqBy';
import { useCallback, useMemo } from 'react';
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
const ReactionItem: React.FC<{
  reaction: GroupedReaction;
  onClick: () => void;
}> = React.memo((props) => {
  const { reaction, onClick } = props;

  return (
    <div className="py-0.5 px-1 bg-black bg-opacity-20 hover:bg-opacity-40 rounded flex cursor-pointer">
      <Tooltip title={useUsernames(reaction.users)}>
        <div onClick={onClick}>
          <Emoji emoji={reaction.name} />

          {reaction.length > 1 && <span>{reaction.length}</span>}
        </div>
      </Tooltip>
    </div>
  );
});
ReactionItem.displayName = 'ReactionItem';

/**
 * 消息反应表情渲染
 */
export function useMessageReactions(payload: ChatMessage) {
  const messageId = payload._id;
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

  const handleClick = useCallback(
    (reactionName: string) => {
      removeReaction(messageId, reactionName);
    },
    [messageId]
  );

  return (
    <div className="flex chat-message-reactions gap-1 py-0.5">
      {groupedReactions.map((reaction) => (
        <ReactionItem
          key={reaction.name}
          reaction={reaction}
          onClick={() => handleClick(reaction.name)}
        />
      ))}
    </div>
  );
}
