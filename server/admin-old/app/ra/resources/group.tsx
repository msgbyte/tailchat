import {
  Datagrid,
  DateField,
  List,
  TextField,
  ShowButton,
  SearchInput,
  ArrayField,
  SingleFieldList,
  ChipField,
  Show,
  SelectField,
  TabbedShowLayout,
  ImageField,
  useTranslate,
} from 'react-admin';
import { Box } from '@mui/material';
import { UserField } from '../components/UserField';

const PostListActionToolbar = ({ children, ...props }) => (
  <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);

export const GroupList: React.FC = () => (
  <List filters={[<SearchInput key="search" source="q" alwaysOn />]}>
    <Datagrid>
      <TextField source="id" sortable={true} sortByOrder="DESC" />
      <TextField source="name" />
      <TextField source="owner" />
      <TextField source="members.length" />
      <TextField source="panels.length" />
      <ArrayField source="roles">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <TextField source="fallbackPermissions" />
      <DateField source="createdAt" />
      <PostListActionToolbar>
        <ShowButton />
      </PostListActionToolbar>
    </Datagrid>
  </List>
);
GroupList.displayName = 'GroupList';

export const GroupShow: React.FC = () => {
  const translate = useTranslate();

  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label={translate('custom.common.summary')}>
          <TextField source="id" />
          <ImageField
            source="avatar"
            emptyText={`(${translate('custom.groups.noAvatar')})`}
          />
          <TextField source="name" />
          <UserField source="owner" />

          <DateField source="createdAt" />
          <DateField source="updatedAt" />
          <TextField source="fallbackPermissions" />
          <TextField source="config" />
        </TabbedShowLayout.Tab>

        {/* 面板 */}
        <TabbedShowLayout.Tab label={translate('custom.common.panel')}>
          <ArrayField source="panels">
            <Datagrid>
              <TextField source="id" />
              <TextField
                source="name"
                label={translate('custom.groups.panels.name')}
              />
              <SelectField
                source="type"
                choices={[
                  { id: 0, name: translate('custom.groups.textPanel') },
                  { id: 1, name: translate('custom.groups.groupPanel') },
                  { id: 2, name: translate('custom.groups.pluginPanel') },
                ]}
                label={translate('custom.groups.panels.type')}
              />
              <TextField
                source="provider"
                label={translate('custom.groups.panels.provider')}
              />
              <TextField
                source="pluginPanelName"
                label={translate('custom.groups.panels.name')}
              />
              <TextField
                source="meta"
                label={translate('custom.groups.panels.meta')}
              />
              <TextField
                source="parentId"
                label={translate('custom.groups.panels.parentId')}
              />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>

        {/* 身份组 */}
        <TabbedShowLayout.Tab
          label={translate('resources.groups.fields.roles')}
        >
          <ArrayField source="roles">
            <Datagrid>
              <TextField
                source="name"
                label={translate('custom.common.name')}
              />
              <TextField
                source="permission"
                label={translate('custom.common.permission')}
              />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>

        {/* 成员列表 */}
        <TabbedShowLayout.Tab
          label={translate('resources.groups.fields.members')}
        >
          <ArrayField source="members">
            <Datagrid>
              <UserField source="userId" />
              <TextField source="roles" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
GroupShow.displayName = 'GroupShow';
