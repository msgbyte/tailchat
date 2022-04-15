import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import { Alert } from 'antd';
import React, { useMemo } from 'react';
import { isValidStr, t, useGroupPanelInfo } from 'tailchat-shared';
import { GroupPanelWrapper } from './Wrapper';

interface GroupPluginPanelProps {
  groupId: string;
  panelId: string;
}

/**
 * 插件群组面板
 */
export const GroupPluginPanel: React.FC<GroupPluginPanelProps> = React.memo(
  (props) => {
    const panelInfo = useGroupPanelInfo(props.groupId, props.panelId);

    if (!panelInfo) {
      return (
        <Alert className="w-full text-center" message={t('无法获取面板信息')} />
      );
    }

    if (typeof panelInfo.provider !== 'string') {
      return (
        <Alert
          className="w-full text-center"
          message={t('未找到插件的提供者')}
        />
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
          message={
            <div>
              <p>{t('该面板由插件提供')}</p>
              <p>
                {t('插件名')}: {panelInfo.provider}
              </p>
              <p>
                {t('面板名')}: {panelInfo.pluginPanelName}
              </p>
            </div>
          }
        />
      );
    }

    const Component = pluginPanelInfo.render;

    if (!Component) {
      // 没有找到插件组件
      // TODO: Fallback
      return null;
    }

    return (
      <GroupPanelWrapper
        groupId={props.groupId}
        panelId={props.panelId}
        showHeader={false}
      >
        <Component panelInfo={panelInfo} />
      </GroupPanelWrapper>
    );
  }
);
GroupPluginPanel.displayName = 'GroupPluginPanel';
