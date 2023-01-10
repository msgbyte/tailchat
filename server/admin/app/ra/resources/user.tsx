import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  List,
  TextField,
  ShowButton,
  EditButton,
  SearchInput,
} from 'react-admin';
import React from 'react';
import { Box } from '@mui/material';

const PostListActionToolbar = ({ children, ...props }) => (
  <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);

export const UserList: React.FC = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid>
      <TextField source="id" label="用户ID" sortByOrder="DESC" />
      <EmailField source="email" label="邮箱" />
      <TextField source="nickname" label="昵称" />
      <TextField source="discriminator" label="标识符" />
      <BooleanField source="temporary" label="是否游客" />
      <TextField source="avatar" label="头像" />
      <TextField source="type" label="用户类型" />
      <TextField source="password" label="密码" />
      <TextField source="settings" label="用户设置" />
      <DateField source="createdAt" label="创建时间" />
      <PostListActionToolbar>
        <ShowButton />
        <EditButton />
      </PostListActionToolbar>
    </Datagrid>
  </List>
);
UserList.displayName = 'UserList';
