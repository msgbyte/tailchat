import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { PersonalConverse } from './Converse';
import { FriendPanel } from './Friends';
import { PluginsPanel } from './Plugins';
import { PersonalSidebar } from './Sidebar';

export const Personal: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-personal" sidebar={<PersonalSidebar />}>
      <Switch>
        <Route path="/main/personal/friends" component={FriendPanel} />

        <Route path="/main/personal/plugins" component={PluginsPanel} />

        <Route
          path="/main/personal/converse/:converseId"
          component={PersonalConverse}
        />

        <Redirect to="/main/personal/friends" />
      </Switch>
    </PageContent>
  );
});
Personal.displayName = 'Personal';
