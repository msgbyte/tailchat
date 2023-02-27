import { Admin, Resource, ShowGuesser, CustomRoutes } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { authProvider } from './authProvider';
import { UserEdit, UserList, UserShow } from './resources/user';
import React from 'react';
import { GroupList, GroupShow } from './resources/group';
import { MessageList } from './resources/chat';
import { FileList } from './resources/file';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { theme } from './theme';
import { Dashboard } from './dashboard';
import { Route } from 'react-router-dom';
import { TailchatNetwork } from './routes/network';
import { TailchatLayout } from './layout';
import { i18nProvider } from './i18n/index';
import { httpClient } from './request';
import { SocketIOAdmin } from './routes/socketio';

const dataProvider = jsonServerProvider(
  // 'https://jsonplaceholder.typicode.com'
  '/admin/api',
  httpClient
);

export const App = () => (
  <Admin
    basename="/admin"
    theme={theme}
    dashboard={Dashboard}
    layout={TailchatLayout}
    disableTelemetry={true}
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    requireAuth={true}
  >
    <Resource
      icon={PersonIcon}
      name="users"
      list={UserList}
      show={UserShow}
      edit={UserEdit}
    />
    <Resource
      icon={MessageIcon}
      name="messages"
      list={MessageList}
      show={ShowGuesser}
    />
    <Resource
      icon={GroupIcon}
      name="groups"
      list={GroupList}
      show={GroupShow}
    />
    <Resource
      icon={AttachFileIcon}
      name="file"
      list={FileList}
      show={ShowGuesser}
    />

    <CustomRoutes>
      {/* 添加完毕以后还需要到 layout/Menu 增加侧边栏 */}
      <Route path="/network" element={<TailchatNetwork />} />
      <Route path="/socketio" element={<SocketIOAdmin />} />
    </CustomRoutes>
  </Admin>
);
