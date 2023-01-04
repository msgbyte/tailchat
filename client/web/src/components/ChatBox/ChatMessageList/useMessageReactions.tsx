import {
  addReaction,
  ChatMessage,
  isValidStr,
  removeReaction,
  useUserId,
  useUsernames,
} from 'tailchat-shared';
import _groupBy from 'lodash/groupBy';
import _uniqBy from 'lodash/uniqBy';
import _take from 'lodash/take';
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
  const usernames = useUsernames(reaction.users);

  return (
    <div className="py-0.5 px-1 bg-black bg-opacity-20 hover:bg-opacity-40 rounded cursor-pointer">
      <Tooltip title={usernames.join(', ')}>
        <div className="flex" onClick={onClick}>
          <Emoji emoji={reaction.name} />

          <div className="ml-1 text-xs">
            {usernames.length < 3 ? (
              <span>{_take(usernames, 2).join(',')}</span>
            ) : (
              <span>
                {_take(usernames, 2).join(', ')}, ...+{usernames.length - 2}
              </span>
            )}
          </div>
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
  const userId = useUserId();

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
    (reaction: GroupedReaction) => {
      if (!isValidStr(userId)) {
        return;
      }

      if (reaction.users.includes(userId)) {
        removeReaction(messageId, reaction.name);
      } else {
        addReaction(messageId, reaction.name);
      }
    },
    [messageId, userId]
  );

  return (
    <div className="flex chat-message-reactions space-x-1 py-0.5">
      {groupedReactions.map((reaction) => (
        <ReactionItem
          key={reaction.name}
          reaction={reaction}
          onClick={() => handleClick(reaction)}
        />
      ))}
    </div>
  );
}
