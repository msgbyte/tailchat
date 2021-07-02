import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginView } from './LoginView';
import bgImage from '../../../assets/images/bg.jpg';
import clsx from 'clsx';
import styles from './index.module.less';
import loginPatternUrl from '../../../assets/images/login-pattern.svg';
import { RegisterView } from './RegisterView';

export const EntryRoute = React.memo(() => {
  return (
    <div className={'h-full flex flex-row'}>
      <div
        className={clsx(
          styles.entryLeft,
          'entry-left w-142 sm:w-full pt-40 bg-gray-600 min-h-full flex justify-center bg-repeat-y'
        )}
        style={{ backgroundImage: `url(${loginPatternUrl})` }}
      >
        <Switch>
          <Route path="/entry/login" component={LoginView} />
          <Route path="/entry/register" component={RegisterView} />
          <Redirect to="/entry/login" />
        </Switch>
      </div>
      <div
        className="flex-1 sm:hidden bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})`, zIndex: -1 }}
      />
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';
