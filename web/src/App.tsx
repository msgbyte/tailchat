import React, { useCallback } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { TcProvider, useDarkMode, useStorage } from 'tailchat-shared';
import clsx from 'clsx';
import { Loadable } from './components/Loadable';
import { ConfigProvider as AntdProvider } from 'antd';
import { PortalHost } from './components/Portal';

const MainRoute = Loadable(() =>
  import('./routes/Main').then((module) => module.MainRoute)
);

const EntryRoute = Loadable(() =>
  import('./routes/Entry').then((module) => module.EntryRoute)
);

const InviteRoute = Loadable(() =>
  import('./routes/Invite').then((module) => module.InviteRoute)
);

const AppProvider: React.FC = React.memo((props) => {
  const getPopupContainer = useCallback(
    (triggerNode: HTMLElement): HTMLElement => {
      const appRoot = document.querySelector<HTMLElement>('#tailchat-app');
      if (appRoot) {
        return appRoot;
      }

      return document.body;
    },
    []
  );

  return (
    <BrowserRouter>
      <TcProvider>
        <AntdProvider getPopupContainer={getPopupContainer}>
          {props.children}
        </AntdProvider>
      </TcProvider>
    </BrowserRouter>
  );
});
AppProvider.displayName = 'AppProvider';

export const AppContainer: React.FC = React.memo((props) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      id="tailchat-app"
      className={clsx('absolute inset-0 select-none', {
        dark: darkMode,
      })}
    >
      {props.children}
    </div>
  );
});
AppContainer.displayName = 'AppContainer';

export const App: React.FC = React.memo(() => {
  return (
    <AppProvider>
      <AppContainer>
        <Switch>
          <Route path="/entry" component={EntryRoute} />
          <Route path="/main" component={MainRoute} />
          <Route path="/invite/:inviteCode" component={InviteRoute} />
          <Redirect to="/entry" />
        </Switch>
      </AppContainer>
    </AppProvider>
  );
});
App.displayName = 'App';
