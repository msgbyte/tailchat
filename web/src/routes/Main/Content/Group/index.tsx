import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { GroupPanelRender } from './Panel';
import { Sidebar } from './Sidebar';

export const Group: React.FC = React.memo(() => {
  return (
    <PageContent sidebar={<Sidebar />}>
      <Switch>
        <Route
          path="/main/group/:groupId/:panelId"
          component={GroupPanelRender}
        />
      </Switch>
    </PageContent>
  );
});
Group.displayName = 'Group';
