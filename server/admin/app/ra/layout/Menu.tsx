import React from 'react';
import {
  Menu,
  MenuProps,
  ResourceMenuItem,
  useResourceDefinitions,
  useTranslate,
} from 'react-admin';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import LinkIcon from '@mui/icons-material/Link';
import SettingsIcon from '@mui/icons-material/Settings';

export const TailchatMenu: React.FC<MenuProps> = React.memo((props) => {
  const resources = useResourceDefinitions();
  const translate = useTranslate();

  return (
    <Menu {...props}>
      <Menu.DashboardItem />

      {...Object.keys(resources)
        .filter((name) => resources[name].hasList)
        .map((name) => <ResourceMenuItem key={name} name={name} />)}

      <Menu.Item
        to="/admin/system"
        primaryText={translate('custom.menu.system')}
        leftIcon={<SettingsIcon />}
      />

      <Menu.Item
        to="/admin/network"
        primaryText={translate('custom.menu.network')}
        leftIcon={<FilterDramaIcon />}
      />

      <Menu.Item
        to="/admin/socketio"
        primaryText={translate('custom.menu.socket')}
        leftIcon={<LinkIcon />}
      />
    </Menu>
  );
});
TailchatMenu.displayName = 'TailchatMenu';
