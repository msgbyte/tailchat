import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { GroupPanelRender } from './Panel';
import { GroupPanelRedirect } from './PanelRedirect';
import { Sidebar } from './Sidebar';

export const Group: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-group" sidebar={<Sidebar />}>
      <Switch>
        <Route
          path="/main/group/:groupId/:panelId"
          component={GroupPanelRender}
        />
        <Route
          path="/main/group/:groupId"
          exact={true}
          component={GroupPanelRedirect}
        />
      </Switch>
    </PageContent>
  );
});
Group.displayName = 'Group';
