import { IsDeveloping } from '@/components/IsDeveloping';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { ConversePanel } from './Converse';
import { FriendPanel } from './Friends';
import { Sidebar } from './Sidebar';

export const Personal: React.FC = React.memo(() => {
  return (
    <PageContent sidebar={<Sidebar />}>
      <Switch>
        <Route path="/main/personal/friends" component={FriendPanel} />

        <Route path="/main/personal/plugins" component={IsDeveloping} />

        <Route
          path="/main/personal/converse/:converseUUID"
          component={ConversePanel}
        />

        <Redirect to="/main/personal/friends" />
      </Switch>
    </PageContent>
  );
});
Personal.displayName = 'Personal';
