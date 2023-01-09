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
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="nickname" />
      <TextField source="discriminator" />
      <BooleanField source="temporary" />
      <TextField source="avatar" />
      <TextField source="type" />
      <TextField source="password" />
      <TextField source="settings" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <PostListActionToolbar>
        <ShowButton />
        <EditButton />
      </PostListActionToolbar>
    </Datagrid>
  </List>
);
UserList.displayName = 'UserList';
