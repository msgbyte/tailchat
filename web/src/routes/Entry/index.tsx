import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginView } from './LoginView';

export const EntryRoute = React.memo(() => {
  return (
    <div>
      <Switch>
        <Route path="/entry/login" component={LoginView} />
        <Redirect to="/entry/login" />
      </Switch>
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';
