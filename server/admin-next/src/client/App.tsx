import {
  createTextField,
  CustomRoute,
  jsonServerProvider,
  ListTable,
  Resource,
  Tushan,
} from 'tushan';
import {
  IconDashboard,
  IconEmail,
  IconFile,
  IconMessage,
  IconSettings,
  IconUser,
  IconUserGroup,
  IconWifi,
} from 'tushan/icon';
import { authProvider } from './auth';
import { Dashboard } from './components/Dashboard';
import { fileFields, groupFields, mailFields, messageFields } from './fields';
import { i18n } from './i18n';
import { httpClient } from './request';
import { UserList } from './resources/user';
import { TailchatNetwork } from './routes/network';
import { SocketIOAdmin } from './routes/socketio';
import { SystemConfig } from './routes/system';

const dataProvider = jsonServerProvider('/admin/api', httpClient);

function App() {
  return (
    <Tushan
      basename="/admin"
      dashboard={<Dashboard />}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18n={i18n}
    >
      <Resource name="users" icon={<IconUser />} list={<UserList />} />

      <Resource
        name="messages"
        icon={<IconMessage />}
        list={
          <ListTable
            filter={[
              createTextField('q', {
                label: 'Search',
              }),
            ]}
            fields={messageFields}
            action={{ detail: true, edit: true, delete: true, export: true }}
          />
        }
      />

      <Resource
        name="groups"
        icon={<IconUserGroup />}
        list={
          <ListTable
            filter={[
              createTextField('q', {
                label: 'Search',
              }),
            ]}
            fields={groupFields}
            action={{ detail: true, edit: true, delete: true, export: true }}
          />
        }
      />

      <Resource
        name="file"
        icon={<IconFile />}
        list={
          <ListTable
            filter={[
              createTextField('q', {
                label: 'Search',
              }),
            ]}
            fields={fileFields}
            action={{ detail: true }}
          />
        }
      />

      <Resource
        name="mail"
        icon={<IconEmail />}
        list={<ListTable fields={mailFields} />}
      />

      <CustomRoute name="system" icon={<IconSettings />}>
        <SystemConfig />
      </CustomRoute>

      <CustomRoute name="network" icon={<IconWifi />}>
        <TailchatNetwork />
      </CustomRoute>

      <CustomRoute name="socketio" icon={<IconDashboard />}>
        <SocketIOAdmin />
      </CustomRoute>
    </Tushan>
  );
}

export default App;
