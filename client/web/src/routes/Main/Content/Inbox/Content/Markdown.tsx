import { Markdown } from '@/components/Markdown';
import { CommonPanelWrapper } from '@/components/Panel/common/Wrapper';
import { Problem } from '@/components/Problem';
import React from 'react';
import { MarkdownInboxItem, t } from 'tailchat-shared';

interface Props {
  info: MarkdownInboxItem;
}
export const InboxMarkdownContent: React.FC<Props> = React.memo((props) => {
  const info = props.info;

  const payload = info.payload;
  if (!payload) {
    return <Problem />;
  }

  return (
    <CommonPanelWrapper header={payload.title ?? t('新消息')}>
      <div className="h-full overflow-auto p-2">
        <Markdown raw={payload.content ?? ''} />
      </div>
    </CommonPanelWrapper>
  );
});
InboxMarkdownContent.displayName = 'InboxMarkdownContent';
