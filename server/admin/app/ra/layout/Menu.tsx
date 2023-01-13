import React from 'react';
import {
  Menu,
  MenuProps,
  ResourceMenuItem,
  useResourceDefinitions,
} from 'react-admin';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

export const TailchatMenu: React.FC<MenuProps> = React.memo((props) => {
  const resources = useResourceDefinitions();

  return (
    <Menu {...props}>
      <Menu.DashboardItem />

      {...Object.keys(resources)
        .filter((name) => resources[name].hasList)
        .map((name) => <ResourceMenuItem key={name} name={name} />)}

      <Menu.Item
        to="/admin/network"
        primaryText="Tailchat 网络"
        leftIcon={<FilterDramaIcon />}
      />
    </Menu>
  );
});
TailchatMenu.displayName = 'TailchatMenu';
