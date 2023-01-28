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
      <TextField source="id" label="用户ID" sortByOrder="DESC" />
      <EmailField source="email" label="邮箱" />
      <TextField source="nickname" label="昵称" />
      <TextField source="discriminator" label="标识符" />
      <BooleanField source="temporary" label="是否游客" />
      <ImageField
        sx={{ '.RaImageField-image': { height: 40, width: 40 } }}
        source="avatar"
        label="头像"
      />
      <TextField source="type" label="用户类型" />
      <TextField source="settings" label="用户设置" />
      <DateField source="createdAt" label="创建时间" />
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
      <DateField source="updatedAt" />
      <BooleanField source="settings.messageListVirtualization" />
    </SimpleShowLayout>
  </Show>
);
UserShow.displayName = 'UserShow';
