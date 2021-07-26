import React, { useCallback } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { TcProvider, useStorage } from 'tailchat-shared';
import clsx from 'clsx';
import { Loadable } from './components/Loadable';
import { ConfigProvider as AntdProvider } from 'antd';

const MainRoute = Loadable(() =>
  import('./routes/Main').then((module) => module.MainRoute)
);

const EntryRoute = Loadable(() =>
  import('./routes/Entry').then((module) => module.EntryRoute)
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

export const App: React.FC = React.memo(() => {
  const [darkMode] = useStorage('darkMode', true);

  return (
    <div
      id="tailchat-app"
      className={clsx('h-screen w-screen min-h-screen select-none', {
        dark: darkMode,
      })}
    >
      <AppProvider>
        <Switch>
          <Route path="/entry" component={EntryRoute} />
          <Route path="/main" component={MainRoute} />
          <Redirect to="/entry" />
        </Switch>
      </AppProvider>
    </div>
  );
});
App.displayName = 'App';
