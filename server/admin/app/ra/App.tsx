import {
  Admin,
  Resource,
  ListGuesser,
  fetchUtils,
  EditGuesser,
  ShowGuesser,
} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { authProvider } from './authProvider';
import { UserList } from './resources/user';
import React from 'react';
import { GroupList } from './resources/group';
import { MessageList } from './resources/chat';
import { FileList } from './resources/file';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { theme } from './theme';
import { Dashboard } from './dashboard';

const httpClient: typeof fetchUtils.fetchJson = (url, options = {}) => {
  try {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }
    const { token } = JSON.parse(window.localStorage.getItem('auth') ?? '');
    (options.headers as Headers).set('Authorization', `Bearer ${token}`);

    return fetchUtils.fetchJson(url, options);
  } catch (err) {
    return Promise.reject();
  }
};

const dataProvider = jsonServerProvider(
  // 'https://jsonplaceholder.typicode.com'
  '/admin/api'
  // httpClient
);

export const App = () => (
  <Admin
    basename="/admin"
    theme={theme}
    dashboard={Dashboard}
    disableTelemetry={true}
    authProvider={authProvider}
    dataProvider={dataProvider}
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
      show={ShowGuesser}
    />
    <Resource
      icon={AttachFileIcon}
      name="file"
      options={{ label: '文件' }}
      list={FileList}
      show={ShowGuesser}
    />
  </Admin>
);
