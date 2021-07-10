import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { FriendPanel } from './Friends';
import { Sidebar } from './Sidebar';

export const Personal: React.FC = React.memo(() => {
  return (
    <PageContent sidebar={<Sidebar />}>
      <Switch>
        <Route path="/main/personal/friends" component={FriendPanel} />

        <Redirect to="/main/personal/friends" />
      </Switch>
    </PageContent>
  );
});
Personal.displayName = 'Personal';
