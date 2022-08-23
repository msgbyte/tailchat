import React from 'react';
import { Personal } from './Personal';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Group } from './Group';

export const MainContent: React.FC = React.memo(() => {
  return (
    <Switch>
      <Route path="/main/personal" component={Personal} />
      <Route path="/main/group/:groupId" component={Group} />
      <Redirect to="/main/personal" />
    </Switch>
  );
});
MainContent.displayName = 'MainContent';
