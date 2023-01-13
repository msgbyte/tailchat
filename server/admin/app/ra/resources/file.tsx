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
    <Datagrid>
      <TextField source="objectName" label="对象存储名" />
      <UrlField source="url" target="__blank" label="文件路径" />
      <FilesizeField source="size" noWrap={true} />
      <TextField source="metaData.content-type" label="文件类型" />
      <TextField source="etag" />
      <ReferenceField source="userId" reference="users" label="存储用户">
        <TextField source="nickname" />
        (<TextField source="email" />)
      </ReferenceField>
      <DateField source="createdAt" label="创建时间" />
    </Datagrid>
  </List>
);
