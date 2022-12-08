import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginView } from './LoginView';
import clsx from 'clsx';
import styles from './index.module.less';
import loginPatternUrl from '@assets/images/login-pattern.svg';
import { RegisterView } from './RegisterView';
import { useRecordMeasure } from '@/utils/measure-helper';
import { GuestView } from './GuestView';
import { ForgetPasswordView } from './ForgetPasswordView';

const EntryRoute = React.memo(() => {
  useRecordMeasure('appEntryRenderStart');

  return (
    <div className="h-full flex flex-row">
      <div
        className={clsx(
          styles.entryLeft,
          'entry-left w-142 mobile:w-full pt-40 px-4 bg-gray-600 min-h-full flex justify-center bg-repeat-y z-10'
        )}
        style={{ backgroundImage: `url(${loginPatternUrl})` }}
      >
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/guest" element={<GuestView />} />
          <Route path="/forget" element={<ForgetPasswordView />} />
          <Route
            path="/"
            element={<Navigate to="/entry/login" replace={true} />}
          />
        </Routes>
      </div>

      <div className="flex-1 mobile:hidden tc-background" />
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';

export default EntryRoute;
