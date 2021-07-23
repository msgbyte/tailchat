import React from 'react';
import { PageContent } from '../PageContent';
import { Sidebar } from './Sidebar';

export const Group: React.FC = React.memo(() => {
  return (
    <PageContent sidebar={<Sidebar />}>
      <div>TODO</div>
    </PageContent>
  );
});
Group.displayName = 'Group';
