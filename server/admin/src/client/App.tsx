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
  IconNotification,
  IconSettings,
  IconStorage,
  IconUser,
  IconUserGroup,
  IconWifi,
} from 'tushan/icon';
import { authHTTPClient, authProvider } from './auth';
import { Dashboard } from './components/Dashboard';
import { fileFields, groupFields, mailFields, messageFields } from './fields';
import { i18n } from './i18n';
import { UserList } from './resources/user';
import { CacheManager } from './routes/cache';
import { TailchatNetwork } from './routes/network';
import { SocketIOAdmin } from './routes/socketio';
import { SystemConfig } from './routes/system';
import { SystemNotify } from './routes/system/notify';

const dataProvider = jsonServerProvider('/admin/api', authHTTPClient);

function App() {
  return (
    <Tushan
      basename="/admin"
      header={'Tailchat Admin'}
      footer={'Build with MsgByte'}
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
            showSizeChanger={true}
            fields={messageFields}
            action={{ detail: true, edit: true, delete: true, export: true }}
            batchAction={{ delete: true }}
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

      <CustomRoute name="network" icon={<IconWifi />}>
        <TailchatNetwork />
      </CustomRoute>

      <CustomRoute name="socketio" icon={<IconDashboard />}>
        <SocketIOAdmin />
      </CustomRoute>

      <CustomRoute name="cache" icon={<IconStorage />}>
        <CacheManager />
      </CustomRoute>

      <CustomRoute name="system-notify" icon={<IconNotification />}>
        <SystemNotify />
      </CustomRoute>

      <CustomRoute name="system" icon={<IconSettings />}>
        <SystemConfig />
      </CustomRoute>
    </Tushan>
  );
}

export default App;
