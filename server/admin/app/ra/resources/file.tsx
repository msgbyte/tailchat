import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
  UrlField,
} from 'react-admin';
import { FilesizeField } from '../components/FilesizeField';

export const FileList: React.FC = () => (
  <List>
    <Datagrid bulkActionButtons={false}>
      <TextField source="objectName" />
      <UrlField source="url" target="__blank" />
      <FilesizeField source="size" noWrap={true} />
      <TextField source="metaData.content-type" />
      <TextField source="etag" />
      <ReferenceField source="userId" reference="users">
        <TextField source="nickname" />
        (<TextField source="email" />)
      </ReferenceField>
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);
