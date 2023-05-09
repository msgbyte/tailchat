import {
  createTextField,
  jsonServerProvider,
  ListTable,
  Resource,
  Tushan,
} from 'tushan';
import { IconFile, IconMessage, IconUser, IconUserGroup } from 'tushan/icon';
import { authProvider } from './auth';
import { fileFields, groupFields, messageFields, userFields } from './fields';
import { httpClient } from './request';

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
            action={{ create: true, detail: true, edit: true, delete: true }}
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
            action={{ detail: true, edit: true, delete: true }}
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
            action={{ detail: true, edit: true, delete: true }}
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
    </Tushan>
  );
}

export default App;
