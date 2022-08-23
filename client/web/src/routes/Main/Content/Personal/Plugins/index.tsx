import { PluginStore } from '@/plugin/PluginStore';
import React from 'react';

export const PluginsPanel: React.FC = React.memo(() => {
  return <PluginStore />;
});
PluginsPanel.displayName = 'PluginsPanel';
