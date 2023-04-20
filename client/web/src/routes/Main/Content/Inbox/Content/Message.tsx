import { MessageHighlightContainer } from '@/components/ChatBox/ChatMessageList/MessageHighlightContainer';
import { NormalMessageList } from '@/components/ChatBox/ChatMessageList/NormalList';
import { JumpToConverseButton } from '@/components/JumpToButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Problem } from '@/components/Problem';
import React from 'react';
import {
  MessageInboxItem,
  model,
  showErrorToasts,
  useAsync,
} from 'tailchat-shared';

interface Props {
  info: MessageInboxItem;
}
export const InboxMessageContent: React.FC<Props> = React.memo((props) => {
  const info = props.info;

  const payload = info.message ?? info.payload;
  if (!payload) {
    return <Problem />;
  }
  const { groupId, converseId, messageId } = payload;

  return (
    <div className="w-full relative">
      <div className="h-full overflow-auto">
        <NearbyMessages converseId={converseId} messageId={messageId} />
      </div>

      <JumpToConverseButton groupId={groupId} converseId={converseId} />
    </div>
  );
});
InboxMessageContent.displayName = 'InboxMessageContent';

export const NearbyMessages: React.FC<{
  converseId: string;
  messageId: string;
}> = React.memo((props) => {
  const { value = [], loading } = useAsync(async () => {
    try {
      const list = await model.message.fetchNearbyMessage(
        props.converseId,
        props.messageId
      );

      return list;
    } catch (err) {
      showErrorToasts(err);
      console.error(err);
    }
  }, [props.converseId, props.messageId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MessageHighlightContainer messageId={props.messageId}>
      <NormalMessageList
        messages={value}
        isLoadingMore={false}
        hasMoreMessage={false}
        onLoadMore={async () => {}}
      />
    </MessageHighlightContainer>
  );
});
NearbyMessages.displayName = 'NearbyMessages';
