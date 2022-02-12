import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LoginView } from './LoginView';
import clsx from 'clsx';
import styles from './index.module.less';
import loginPatternUrl from '@assets/images/login-pattern.svg';
import { RegisterView } from './RegisterView';
import { useRecordMeasure } from '@/utils/measure-helper';
import { GuestView } from './GuestView';

const EntryRoute = React.memo(() => {
  useRecordMeasure('AppEntryRenderStart');

  return (
    <div className="h-full flex flex-row">
      <div
        className={clsx(
          styles.entryLeft,
          'entry-left w-142 sm:w-full pt-40 px-4 bg-gray-600 min-h-full flex justify-center bg-repeat-y z-10'
        )}
        style={{ backgroundImage: `url(${loginPatternUrl})` }}
      >
        <Switch>
          <Route path="/entry/login" component={LoginView} />
          <Route path="/entry/register" component={RegisterView} />
          <Route path="/entry/guest" component={GuestView} />
          <Redirect to="/entry/login" />
        </Switch>
      </div>

      <div className="flex-1 sm:hidden tc-background" />
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';

export default EntryRoute;
