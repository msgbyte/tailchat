import React from 'react';
import {
  Menu,
  MenuProps,
  ResourceMenuItem,
  useResourceDefinitions,
} from 'react-admin';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import LinkIcon from '@mui/icons-material/Link';

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

      <Menu.Item
        to="/admin/socketio"
        primaryText="Socket.IO 长链接"
        leftIcon={<LinkIcon />}
      />
    </Menu>
  );
});
TailchatMenu.displayName = 'TailchatMenu';
