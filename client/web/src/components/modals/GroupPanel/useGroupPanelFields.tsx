import { UserSelector } from '@/components/UserSelector';
import React from 'react';
import { useMemo } from 'react';
import {
  GroupPanelType,
  isDevelopment,
  t,
  useGroupMemberIds,
} from 'tailchat-shared';
import { MetaFormFieldMeta, useMetaFormContext } from 'tailchat-design';
import type { GroupPanelValues } from './types';
import _compact from 'lodash/compact';
import { pluginGroupPanel } from '@/plugin/common';
import { findPluginPanelInfoByName } from '@/utils/plugin-helper';

const baseFields: MetaFormFieldMeta[] = [
  { type: 'text', name: 'name', label: t('面板名') },
  {
    type: 'select',
    name: 'type',
    label: t('类型'), // 如果为插件则存储插件面板的名称
    options: [
      {
        label: t('聊天频道'),
        value: GroupPanelType.TEXT,
      },
      {
        label: t('面板分组'),
        value: GroupPanelType.GROUP,
      },
      ...pluginGroupPanel.map((pluginPanel) => ({
        label: pluginPanel.label,
        value: pluginPanel.name,
      })),
    ],
  },
];

export function useGroupPanelFields(
  groupId: string,
  currentValues: Partial<GroupPanelValues>
) {
  const disableSendMessageWithoutRender = useMemo(() => {
    const DisableSendMessageWithoutComponent: React.FC = () => {
      const groupMemberUUIDs = useGroupMemberIds(groupId);
      const context = useMetaFormContext<any>();

      return (
        <UserSelector
          allUserIds={groupMemberUUIDs}
          onChange={(userIds) => {
            context?.setValues({
              ...context.values,
              disableSendMessageWithout: userIds,
            });
          }}
        />
      );
    };
    DisableSendMessageWithoutComponent.displayName =
      'DisableSendMessageWithoutComponent';

    return DisableSendMessageWithoutComponent;
  }, [groupId]);

  const fields = useMemo(() => {
    // NOTICE: 仅开发环境有这个配置
    if (isDevelopment && currentValues.type === GroupPanelType.TEXT) {
      return _compact([
        ...baseFields,
        {
          type: 'checkbox',
          name: 'disableSendMessage',
          label: t('禁止所有人发言'),
        },
        currentValues.disableSendMessage === true && {
          type: 'custom',
          name: 'disableSendMessageWithout',
          label: t('仅允许指定用户发言'),
          render: disableSendMessageWithoutRender,
        },
      ]) as MetaFormFieldMeta[];
    }

    if (typeof currentValues.type === 'string') {
      // 如果当前选择的面板类型为插件类型
      // 需要从插件信息中获取额外的字段
      const panelInfo = findPluginPanelInfoByName(currentValues.type);
      if (panelInfo) {
        return [...baseFields, ...panelInfo.extraFormMeta];
      }
    }

    return baseFields;
  }, [currentValues]);

  return fields;
}
