import React from 'react';
import { Personal } from './Personal';
import { Route, Switch, Redirect } from 'react-router-dom';

export const MainContent: React.FC = React.memo(() => {
  return (
    <Switch>
      <Route path="/main/personal" component={Personal} />
      {/* <Route path="/main/group/add">
        <AddGroup />
      </Route>
      <Route path="/main/group/:groupUUID">
        <Group />
      </Route> */}
      <Redirect to="/main/personal" />
    </Switch>
  );
});
MainContent.displayName = 'MainContent';
