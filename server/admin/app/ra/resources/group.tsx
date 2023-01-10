import {
  Datagrid,
  DateField,
  List,
  TextField,
  ShowButton,
  EditButton,
  SearchInput,
  ArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';
import React from 'react';
import { Box } from '@mui/material';

const PostListActionToolbar = ({ children, ...props }) => (
  <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);

export const GroupList: React.FC = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid>
      <TextField
        source="id"
        label="群组ID"
        sortable={true}
        sortByOrder="DESC"
      />
      <TextField source="name" label="群组名称" />
      <TextField source="owner" label="管理员" />
      <TextField source="members.length" label="成员数量" />
      <ArrayField source="panels" label="面板">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="roles" label="角色">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <TextField source="fallbackPermissions" label="默认权限" />
      <DateField source="createdAt" label="创建时间" />
      <PostListActionToolbar>
        <ShowButton />
        <EditButton />
      </PostListActionToolbar>
    </Datagrid>
  </List>
);
GroupList.displayName = 'GroupList';
