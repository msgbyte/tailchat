import { Problem } from '@/components/Problem';
import React from 'react';
import { Route, Routes } from 'react-router';
import { t } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { InboxContent } from './Content';
import { InboxSidebar } from './Sidebar';

export const Inbox: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-inbox" sidebar={<InboxSidebar />}>
      <Routes>
        <Route path="/:inboxItemId" element={<InboxContent />} />
        <Route path="/" element={<InboxNoSelect />} />
      </Routes>
    </PageContent>
  );
});
Inbox.displayName = 'Inbox';

const InboxNoSelect: React.FC = React.memo(() => {
  return (
    <div className="mt-11 w-full">
      <Problem text={t('空空的，什么都没有选中')} />
    </div>
  );
});
InboxNoSelect.displayName = 'InboxNoSelect';
