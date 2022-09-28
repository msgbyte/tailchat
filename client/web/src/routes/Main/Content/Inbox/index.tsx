import React from 'react';
import { PageContent } from '../PageContent';
import { InboxSidebar } from './Sidebar';

export const Inbox: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-inbox" sidebar={<InboxSidebar />}>
      <div>Inbox</div>
    </PageContent>
  );
});
Inbox.displayName = 'Inbox';
