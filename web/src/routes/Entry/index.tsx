import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginView } from './LoginView';
import bgImage from '../../../assets/images/bg.jpg';

export const EntryRoute = React.memo(() => {
  return (
    <div className="h-full flex flex-row">
      <div className="w-142 sm:w-full bg-gray-600 text-white">
        <Switch>
          <Route path="/entry/login" component={LoginView} />
          <Redirect to="/entry/login" />
        </Switch>
      </div>
      <div
        className="flex-1 sm:hidden bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';
