import React from 'react';
import {
  BooleanField,
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
  SearchInput,
} from 'react-admin';

export const MessageList: React.FC = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" sortable={true} sortByOrder="DESC" />
      <TextField source="content" label="内容" />
      <TextField source="author" label="作者" />
      <ReferenceField source="groupId" reference="groups" label="群组ID" />
      <TextField source="converseId" label="会话ID" />
      <BooleanField source="hasRecall" label="撤回" />
      <TextField source="reactions" label="消息反应" />
      <DateField source="createdAt" label="创建时间" />
    </Datagrid>
  </List>
);
MessageList.displayName = 'MessageList';
