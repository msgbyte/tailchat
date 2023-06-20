import {
  BooleanField,
  Datagrid,
  DateField,
  List,
  TextField,
  SearchInput,
  useTranslate,
  BulkDeleteButton,
  ShowButton,
  ReferenceInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  ReferenceField,
} from 'react-admin';
import { GroupField } from '../components/GroupField';
import { PostListActionToolbar } from '../components/PostListActionToolbar';
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
          placeholder={translate('custom.messages.search')}
        />,
        <ReferenceInput key="groupId" source="groupId" reference="groups">
          <SelectInput optionText="name" />
        </ReferenceInput>,
        <SearchInput
          key="search"
          source="converseId"
          placeholder={translate('custom.messages.searchConverseId')}
        />,
      ]}
    >
      <Datagrid
        bulkActionButtons={<BulkDeleteButton mutationMode="optimistic" />}
      >
        <TextField source="id" sortable={true} sortByOrder="DESC" />
        <TextField source="content" />
        <UserField source="author" />
        <GroupField source="groupId" />
        <TextField source="converseId" />
        <BooleanField source="hasRecall" />
        <TextField source="reactions" />
        <DateField source="createdAt" />
        <PostListActionToolbar>
          <ShowButton />
        </PostListActionToolbar>
      </Datagrid>
    </List>
  );
};
MessageList.displayName = 'MessageList';

export const MessageShow: React.FC = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="groupId" reference="groups" />
      <TextField source="converseId" />
      <TextField source="author" />
      <TextField source="content" />
      <TextField source="reactions" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
MessageShow.displayName = 'MessageShow';
