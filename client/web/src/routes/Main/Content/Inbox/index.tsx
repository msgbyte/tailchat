import React, { useState } from 'react';
import { PageContent } from '../PageContent';
import { InboxSidebar } from './Sidebar';

export const Inbox: React.FC = React.memo(() => {
  const [selectedItem, setSelectedItem] = useState('');
  return (
    <PageContent
      data-tc-role="content-inbox"
      sidebar={
        <InboxSidebar selectedItem={selectedItem} onSelect={setSelectedItem} />
      }
    >
      <div>Inbox {selectedItem}</div>
    </PageContent>
  );
});
Inbox.displayName = 'Inbox';
