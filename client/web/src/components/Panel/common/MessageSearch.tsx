import { NormalMessage } from '@/components/ChatBox/ChatMessageList/Item';
import { Empty, Input } from 'antd';
import React from 'react';
import {
  ChatMessage,
  model,
  showToasts,
  t,
  useAsyncRequest,
} from 'tailchat-shared';

export const MessageSearchPanel: React.FC<{
  groupId?: string;
  converseId: string;
}> = React.memo((props) => {
  const { groupId, converseId } = props;
  const [{ loading, value = [] }, handleSearch] = useAsyncRequest(
    async (searchText: string) => {
      if (searchText.length < 3) {
        showToasts(t('搜索内容太短无法搜索'));
        return;
      }
      const messages = await model.message.searchMessage(
        searchText,
        converseId,
        groupId
      );

      return messages ?? [];
    }
  );

  const searchedMessages = value as ChatMessage[];

  return (
    <div className="p-2">
      <Input.Search
        className="mb-2"
        placeholder={t('请输入关键字')}
        loading={loading}
        onSearch={handleSearch}
      />

      {/* Result List */}
      <div>
        {searchedMessages.length === 0 && (
          <Empty description={t('没有任何搜索结果')} />
        )}

        {searchedMessages.map((message) => (
          <NormalMessage
            key={message._id}
            showAvatar={true}
            payload={message}
            hideAction={true}
          />
        ))}
      </div>
    </div>
  );
});
MessageSearchPanel.displayName = 'MessageSearchPanel';
