import {
  Category,
  createTextField,
  CustomRoute,
  jsonServerProvider,
  ListTable,
  Resource,
  Tushan,
} from 'tushan';
import {
  IconCompass,
  IconDashboard,
  IconEmail,
  IconExperiment,
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
import {
  discoverFields,
  fileFields,
  mailFields,
  messageFields,
} from './fields';
import { i18n } from './i18n';
import { GroupList } from './resources/group';
import { UserList } from './resources/user';
import { TailchatAnalytics } from './routes/analytics';
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
      <CustomRoute name="analytics" icon={<IconExperiment />}>
        <TailchatAnalytics />
      </CustomRoute>

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

      <Resource name="groups" icon={<IconUserGroup />} list={<GroupList />} />

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

      <Category name="plugins">
        <Resource
          name="p_discover"
          icon={<IconCompass />}
          list={
            <ListTable
              fields={discoverFields}
              action={{ create: true, detail: true, delete: true }}
            />
          }
        />
      </Category>

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
