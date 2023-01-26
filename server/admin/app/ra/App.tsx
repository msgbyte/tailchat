import { Admin, Resource, ShowGuesser, CustomRoutes } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { authProvider } from './authProvider';
import { UserList } from './resources/user';
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
import { TailchatNetwork } from './network';
import { TailchatLayout } from './layout';
import { i18nProvider } from './i18n';
import { httpClient } from './request';

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
      options={{ label: '用户管理' }}
      list={UserList}
      show={ShowGuesser}
    />
    <Resource
      icon={MessageIcon}
      name="messages"
      options={{ label: '聊天信息' }}
      list={MessageList}
      show={ShowGuesser}
    />
    <Resource
      icon={GroupIcon}
      name="groups"
      options={{ label: '群组' }}
      list={GroupList}
      show={GroupShow}
    />
    <Resource
      icon={AttachFileIcon}
      name="file"
      options={{ label: '文件' }}
      list={FileList}
      show={ShowGuesser}
    />

    <CustomRoutes>
      <Route path="/network" element={<TailchatNetwork />} />
    </CustomRoutes>
  </Admin>
);
