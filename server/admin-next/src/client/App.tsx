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
import {
  fileFields,
  groupFields,
  mailFields,
  messageFields,
  userFields,
} from './fields';
import { httpClient } from './request';
import { TailchatNetwork } from './routes/network';
import { SocketIOAdmin } from './routes/socketio';
import { SystemConfig } from './routes/system';

const dataProvider = jsonServerProvider('/admin/api', httpClient);

function App() {
  return (
    <Tushan
      basename="/admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      <Resource
        name="users"
        label="User"
        icon={<IconUser />}
        list={
          <ListTable
            filter={[
              createTextField('q', {
                label: 'Search',
              }),
            ]}
            fields={userFields}
            action={{
              create: true,
              detail: true,
              edit: true,
              delete: true,
              export: true,
            }}
          />
        }
      />

      <Resource
        name="messages"
        label="Messages"
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
        label="Groups"
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
        label="Files"
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
        label="Mails"
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
