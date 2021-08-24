import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { ConversePanel } from './Converse';
import { FriendPanel } from './Friends';
import { PluginsPanel } from './Plugins';
import { Sidebar } from './Sidebar';

export const Personal: React.FC = React.memo(() => {
  return (
    <PageContent sidebar={<Sidebar />}>
      <Switch>
        <Route path="/main/personal/friends" component={FriendPanel} />

        <Route path="/main/personal/plugins" component={PluginsPanel} />

        <Route
          path="/main/personal/converse/:converseId"
          component={ConversePanel}
        />

        <Redirect to="/main/personal/friends" />
      </Switch>
    </PageContent>
  );
});
Personal.displayName = 'Personal';
