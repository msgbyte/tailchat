import { NormalMessageList } from '@/components/ChatBox/ChatMessageList/NormalList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Problem } from '@/components/Problem';
import React from 'react';
import { useNavigate } from 'react-router';
import {
  InboxItem,
  model,
  showErrorToasts,
  t,
  useAsync,
} from 'tailchat-shared';

interface Props {
  info: InboxItem;
}
export const InboxMessageContent: React.FC<Props> = React.memo((props) => {
  const info = props.info;
  const navigate = useNavigate();

  const message = info.message;
  if (!message) {
    return <Problem />;
  }
  const { groupId, converseId, messageId } = message;

  return (
    <div className="w-full relative">
      <NearbyMessages converseId={converseId} messageId={messageId} />

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div
          className="shadow-lg px-6 py-2 rounded-full inline-block bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          onClick={() => {
            if (groupId) {
              // 跳转到群组
              navigate(`/main/group/${groupId}/${converseId}`);
            } else {
              navigate(`/main/personal/converse/${converseId}`);
            }
          }}
        >
          {t('跳转到会话')}
        </div>
      </div>
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
    <div>
      <NormalMessageList
        messages={value}
        isLoadingMore={false}
        hasMoreMessage={false}
        onLoadMore={async () => {}}
      />
    </div>
  );
});
NearbyMessages.displayName = 'NearbyMessages';
