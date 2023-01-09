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
    authProvider={authProvider}
    dataProvider={dataProvider}
  >
    <Resource
      name="users"
      options={{ label: '用户管理' }}
      list={UserList}
      show={ShowGuesser}
    />
  </Admin>
);
