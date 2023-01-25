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
  SimpleShowLayout,
  NumberField,
  ReferenceField,
  BooleanField,
  SelectField,
  TabbedShowLayout,
  ImageField,
} from 'react-admin';
import React from 'react';
import { Box } from '@mui/material';
import { UserField } from '../components/UserField';

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
      <TextField source="panels.length" label="面板数量" />
      <ArrayField source="roles" label="角色">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <TextField source="fallbackPermissions" label="默认权限" />
      <DateField source="createdAt" label="创建时间" />
      <PostListActionToolbar>
        <ShowButton />
      </PostListActionToolbar>
    </Datagrid>
  </List>
);
GroupList.displayName = 'GroupList';

export const GroupShow: React.FC = () => (
  <Show>
    <TabbedShowLayout>
      <TabbedShowLayout.Tab label="概述">
        <TextField source="id" />
        <ImageField source="avatar" label="头像" emptyText="(无头像)" />
        <TextField source="name" label="群组名" />
        <UserField source="owner" label="所有人" />

        <DateField source="createdAt" label="创建时间" />
        <DateField source="updatedAt" label="更新时间" />
        <TextField source="fallbackPermissions" label="默认权限" />
        <TextField source="config" label="配置信息" />
      </TabbedShowLayout.Tab>

      {/* 面板 */}
      <TabbedShowLayout.Tab label="面板">
        <ArrayField source="panels" label="群组面板">
          <Datagrid>
            <TextField source="id" />
            <TextField source="name" label="面板名" />
            <SelectField
              source="type"
              choices={[
                { id: 0, name: '文本频道' },
                { id: 1, name: '面板分组' },
                { id: 2, name: '插件面板' },
              ]}
              label={'面板类型'}
            />
            <TextField source="provider" label="面板供应插件" />
            <TextField source="pluginPanelName" label="插件面板名" />
            <TextField source="meta" label="面板元信息" />
            <TextField source="parentId" label="面板父级" />
          </Datagrid>
        </ArrayField>
      </TabbedShowLayout.Tab>

      {/* 身份组 */}
      <TabbedShowLayout.Tab label="身份组">
        <ArrayField source="roles" label="身份组">
          <Datagrid>
            <TextField source="name" label="名称" />
            <TextField source="permission" label="权限" />
          </Datagrid>
        </ArrayField>
      </TabbedShowLayout.Tab>

      {/* 成员列表 */}
      <TabbedShowLayout.Tab label="成员列表">
        <ArrayField source="members" label="成员列表">
          <Datagrid>
            <UserField source="userId" label="成员" />
            <TextField source="roles" label="角色" />
          </Datagrid>
        </ArrayField>
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>
);
GroupShow.displayName = 'GroupShow';
