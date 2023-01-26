import React, { PropsWithChildren, Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import {
  sharedEvent,
  TcProvider,
  useColorScheme,
  useLanguage,
} from 'tailchat-shared';
import clsx from 'clsx';
import { Loadable } from './components/Loadable';
import { ConfigProvider as AntdProvider } from 'antd';
import { Helmet } from 'react-helmet';
import { useRecordMeasure } from './utils/measure-helper';
import { getPopupContainer, preventDefault } from './utils/dom-helper';
import { LoadingSpinner } from './components/LoadingSpinner';
import { pluginRootRoute } from './plugin/common';
import { PortalHost as FallbackPortalHost } from './components/Portal';
import isElectron from 'is-electron';
import { AppRouterApi } from './components/AppRouterApi';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const AppRouter: any = isElectron() ? HashRouter : BrowserRouter;

const MainRoute = Loadable(
  () =>
    import(
      /* webpackChunkName: 'main' */ /* webpackPreload: true */ './routes/Main'
    )
);

const EntryRoute = Loadable(
  () =>
    import(
      /* webpackChunkName: 'entry' */ /* webpackPreload: true */ './routes/Entry'
    )
);

const PanelRoute = Loadable(() => import('./routes/Panel'));

const InviteRoute = Loadable(
  () =>
    import(
      /* webpackChunkName: 'invite' */ /* webpackPreload: true */
      './routes/Invite'
    )
);

const AppProvider: React.FC<PropsWithChildren> = React.memo((props) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRouter>
        <TcProvider>
          <DndProvider backend={HTML5Backend}>
            <AntdProvider getPopupContainer={getPopupContainer}>
              {props.children}
            </AntdProvider>
          </DndProvider>
        </TcProvider>
      </AppRouter>
    </Suspense>
  );
});
AppProvider.displayName = 'AppProvider';

const AppContainer: React.FC<PropsWithChildren> = React.memo((props) => {
  const { isDarkMode, extraSchemeName } = useColorScheme();

  return (
    <div
      id="tailchat-app"
      className={clsx(
        'tailchat-app',
        'absolute inset-0 select-none overflow-hidden',
        {
          dark: isDarkMode,
        },
        extraSchemeName
      )}
      onContextMenu={preventDefault}
    >
      {props.children}
    </div>
  );
});
AppContainer.displayName = 'AppContainer';

const AppHeader: React.FC = React.memo(() => {
  const { language } = useLanguage();

  return (
    <Helmet>
      <meta httpEquiv="Content-Language" content={language} />
    </Helmet>
  );
});
AppHeader.displayName = 'AppHeader';

export const App: React.FC = React.memo(() => {
  useRecordMeasure('appRenderStart');

  useEffect(() => {
    sharedEvent.emit('appLoaded');
  }, []);

  return (
    <AppProvider>
      <AppHeader />
      <AppContainer>
        <AppRouterApi />
        <Routes>
          <Route
            path="/entry/*"
            element={
              <FallbackPortalHost>
                <EntryRoute />
              </FallbackPortalHost>
            }
          />
          <Route path="/main/*" element={<MainRoute />} />
          <Route path="/panel/*" element={<PanelRoute />} />
          <Route path="/invite/:inviteCode" element={<InviteRoute />} />
          <Route
            path="/plugin/*"
            element={
              <FallbackPortalHost>
                {pluginRootRoute.map((r, i) => (
                  // NOTICE: Switch里不能出现动态路由
                  <Route
                    key={r.name}
                    path={r.path ? `/plugin${r.path}` : `/plugin/fallback${i}`}
                    element={React.createElement(r.component)}
                  />
                ))}
              </FallbackPortalHost>
            }
          />

          <Route path="/*" element={<Navigate to="/entry" replace={true} />} />
        </Routes>
      </AppContainer>
    </AppProvider>
  );
});
App.displayName = 'App';
