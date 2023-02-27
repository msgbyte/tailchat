import React from 'react';
import { Datagrid, DateField, List, TextField, UrlField } from 'react-admin';
import { FilesizeField } from '../components/FilesizeField';
import { UserField } from '../components/UserField';

export const FileList: React.FC = () => (
  <List>
    <Datagrid bulkActionButtons={false}>
      <TextField source="objectName" />
      <UrlField source="url" target="__blank" />
      <FilesizeField source="size" noWrap={true} />
      <TextField source="metaData.content-type" />
      <TextField source="etag" />
      <UserField source="userId" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);
