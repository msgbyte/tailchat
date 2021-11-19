import type { ChatMessage } from 'tailchat-shared';
import _groupBy from 'lodash/groupBy';
import _uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { Emoji } from '@/components/Emoji';
import React from 'react';
import { Tooltip } from 'antd';

/**
 * 消息反应表情渲染
 */
export function useMessageReactions(payload: ChatMessage) {
  const reactions = payload.reactions ?? [];

  const groupedReactions = useMemo(() => {
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
    <div className="flex chat-message-reactions gap-1">
      {groupedReactions.map((reaction) => (
        <div
          key={reaction.name}
          className="py-0.5 px-1 bg-black bg-opacity-20 rounded flex"
        >
          <Emoji emoji={reaction.name} />

          {reaction.length > 1 && <span>{reaction.length}</span>}
        </div>
      ))}
    </div>
  );
}
