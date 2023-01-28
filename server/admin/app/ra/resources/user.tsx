import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  List,
  TextField,
  ShowButton,
  SearchInput,
  ImageField,
  Show,
  SimpleShowLayout,
  TopToolbar,
  useUpdate,
  useShowContext,
} from 'react-admin';
import React from 'react';
import { Box } from '@mui/material';
import { DangerButton } from '../components/DangerButton';
import { ButtonWithConfirm } from '../components/ButtonWithConfirm';

const PostListActionToolbar = ({ children, ...props }) => (
  <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);

export const UserList: React.FC = () => (
  <List
    filters={[
      <SearchInput
        key="search"
        source="q"
        alwaysOn
        placeholder="搜索昵称或邮箱"
      />,
    ]}
  >
    <Datagrid>
      <TextField source="id" sortByOrder="DESC" />
      <EmailField source="email" />
      <TextField source="nickname" />
      <TextField source="discriminator" />
      <BooleanField source="temporary" />
      <ImageField
        sx={{ '.RaImageField-image': { height: 40, width: 40 } }}
        source="avatar"
      />
      <TextField source="type" />
      <TextField source="settings" />
      <DateField source="createdAt" />
      <PostListActionToolbar>
        <ShowButton />
      </PostListActionToolbar>
    </Datagrid>
  </List>
);
UserList.displayName = 'UserList';

const UserShowActions: React.FC = () => {
  const [update] = useUpdate();
  const { record, refetch, resource } = useShowContext();

  return (
    <TopToolbar>
      {/* <EditButton /> */}

      <ButtonWithConfirm
        component={DangerButton}
        label="重置密码"
        confirmContent="重置密码后密码变为: 123456789, 请及时修改密码"
        onConfirm={async () => {
          await update(resource, {
            id: record.id,
            data: {
              password:
                '$2a$10$eSebpg0CEvsbDC7j1NxB2epMUkYwKhfT8vGdPQYkfeXYMqM8HjnpW', // 123456789
            },
          });
          await refetch();
        }}
      />
    </TopToolbar>
  );
};
UserShowActions.displayName = 'UserShowActions';

export const UserShow: React.FC = () => (
  <Show actions={<UserShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <DateField source="createdAt" />
      <EmailField source="email" />
      <TextField source="password" />
      <TextField source="nickname" />
      <TextField source="discriminator" />
      <BooleanField source="temporary" />
      <TextField source="avatar" />
      <TextField source="type" />
      <BooleanField source="settings" />
    </SimpleShowLayout>
  </Show>
);
UserShow.displayName = 'UserShow';
