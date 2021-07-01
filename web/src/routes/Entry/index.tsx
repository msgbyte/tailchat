import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginView } from './LoginView';

export const EntryRoute = React.memo(() => {
  return (
    <div>
      <div>
        <Switch>
          <Route path="/entry/login" component={LoginView} />
          <Redirect to="/entry/login" />
        </Switch>
      </div>
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';
