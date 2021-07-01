import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginView } from './LoginView';
import bgImage from '../../../assets/images/bg.jpg';
import clsx from 'clsx';
import styles from './index.module.less';

export const EntryRoute = React.memo(() => {
  return (
    <div className={'h-full flex flex-row'}>
      <div
        className={clsx(
          styles.entryLeft,
          'entry-left w-142 sm:w-full bg-gray-600 h-full flex items-center justify-center'
        )}
      >
        <Switch>
          <Route path="/entry/login" component={LoginView} />
          <Redirect to="/entry/login" />
        </Switch>
      </div>
      <div
        className="flex-1 sm:hidden bg-center bg-cover bg-no-repeat"
        // style={{ backgroundImage: `url(${bgImage})` }}
      />
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';
