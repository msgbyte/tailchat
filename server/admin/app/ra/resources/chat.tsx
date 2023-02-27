import React from 'react';
import {
  BooleanField,
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
  SearchInput,
  useTranslate,
} from 'react-admin';
import { UserField } from '../components/UserField';

export const MessageList: React.FC = () => {
  const translate = useTranslate();

  return (
    <List
      filters={[
        <SearchInput
          key="search"
          source="q"
          alwaysOn
          placeholder={translate('custom.users.search')}
        />,
      ]}
    >
      <Datagrid rowClick="show">
        <TextField source="id" sortable={true} sortByOrder="DESC" />
        <TextField source="content" />
        <UserField source="author" />
        <ReferenceField source="groupId" reference="groups" />
        <TextField source="converseId" />
        <BooleanField source="hasRecall" />
        <TextField source="reactions" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  );
};
MessageList.displayName = 'MessageList';
