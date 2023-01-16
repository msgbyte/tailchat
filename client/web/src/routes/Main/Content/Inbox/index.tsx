import React from 'react';
import { Route, Routes } from 'react-router';
import { PageContent } from '../PageContent';
import { InboxContent } from './Content';
import { InboxSidebar } from './Sidebar';

export const Inbox: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-inbox" sidebar={<InboxSidebar />}>
      <Routes>
        <Route path="/:inboxItemId" element={<InboxContent />} />
      </Routes>
    </PageContent>
  );
});
Inbox.displayName = 'Inbox';
