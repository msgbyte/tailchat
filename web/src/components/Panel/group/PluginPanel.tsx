import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import { Alert } from 'antd';
import React, { useMemo } from 'react';
import { isValidStr, useGroupPanel } from 'tailchat-shared';

interface GroupPluginPanelProps {
  groupId: string;
  panelId: string;
}

/**
 * 插件群组面板
 */
export const GroupPluginPanel: React.FC<GroupPluginPanelProps> = React.memo(
  (props) => {
    const panelInfo = useGroupPanel(props.groupId, props.panelId);

    if (!panelInfo) {
      return (
        <Alert className="w-full text-center" message="无法获取面板信息" />
      );
    }

    if (typeof panelInfo.provider !== 'string') {
      return (
        <Alert className="w-full text-center" message="未找到插件的提供者" />
      );
    }

    // 从已安装插件注册的群组面板中查找对应群组的面板配置
    const pluginPanelInfo = useMemo(() => {
      if (!isValidStr(panelInfo.pluginPanelName)) {
        return null;
      }

      return findPluginPanelInfoByName(panelInfo.pluginPanelName);
    }, [panelInfo.name]);

    if (!pluginPanelInfo) {
      // TODO: 如果没有安装, 引导用户安装插件
      return (
        <Alert
          className="w-full text-center"
          message={`该面板由插件提供, 插件未安装: ${panelInfo.provider}`}
        />
      );
    }

    const Component = pluginPanelInfo.render;

    if (!Component) {
      return null;
    }
    return <Component />;
  }
);
GroupPluginPanel.displayName = 'GroupPluginPanel';
