import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useStorage } from 'pawchat-shared';
import clsx from 'clsx';
import { Loadable } from './components/Loadable';

import './dark.less';

const MainRoute = Loadable(() =>
  import('./routes/Main').then((module) => module.MainRoute)
);

const EntryRoute = Loadable(() =>
  import('./routes/Entry').then((module) => module.EntryRoute)
);

const AppProvider: React.FC = React.memo((props) => {
  return <BrowserRouter>{props.children}</BrowserRouter>;
});
AppProvider.displayName = 'AppProvider';

export const App: React.FC = React.memo(() => {
  const [darkMode] = useStorage('darkMode', true);

  return (
    <div
      className={clsx('h-screen w-screen min-h-screen', {
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
