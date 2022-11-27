import { UserSelector } from '@/components/UserSelector';
import React from 'react';
import { useMemo } from 'react';
import {
  GroupPanelType,
  isDevelopment,
  t,
  useGroupMemberIds,
} from 'tailchat-shared';
import {
  createMetaFormSchema,
  MetaFormFieldMeta,
  metaFormFieldSchema,
  useMetaFormContext,
} from 'tailchat-design';
import type { GroupPanelValues } from './types';
import _compact from 'lodash/compact';
import _groupBy from 'lodash/groupBy';
import _mapValues from 'lodash/mapValues';
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

const baseSchema = {
  name: metaFormFieldSchema
    .string()
    .required(t('面板名不能为空'))
    .max(20, t('面板名过长')),
  type: metaFormFieldSchema.string().required(t('面板类型不能为空')),
};

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

  const ret = useMemo(() => {
    // NOTICE: 仅开发环境有这个配置
    if (isDevelopment && currentValues.type === GroupPanelType.TEXT) {
      return {
        fields: _compact([
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
        ]) as MetaFormFieldMeta[],
        schema: createMetaFormSchema({
          ...baseSchema,
          disableSendMessage: metaFormFieldSchema.mixed(),
          disableSendMessageWithout: metaFormFieldSchema.mixed(),
        }),
      };
    }

    let fields = baseFields;
    let schema = baseSchema;

    if (typeof currentValues.type === 'string') {
      // 如果当前选择的面板类型为插件类型
      // 需要从插件信息中获取额外的字段
      const panelInfo = findPluginPanelInfoByName(currentValues.type);
      if (panelInfo) {
        const extraFormMeta = Array.isArray(panelInfo.extraFormMeta)
          ? panelInfo.extraFormMeta
          : [];
        fields = [...baseFields, ...extraFormMeta];

        const extraSchema = _mapValues(
          _groupBy(extraFormMeta, (f) => f.name),
          () => metaFormFieldSchema.mixed()
        );

        schema = {
          ...extraSchema,
          ...baseSchema,
        };
      }
    }

    return { fields, schema: createMetaFormSchema(schema) };
  }, [currentValues]);

  return ret;
}
