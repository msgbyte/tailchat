import { pluginGroupPanel } from '@/plugin/common';
import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import React, { useMemo, useState } from 'react';
import {
  FastFormFieldMeta,
  GroupPanelType,
  t,
  useAsyncRequest,
  createGroupPanel,
  createFastFormSchema,
  fieldSchema,
  showToasts,
  useGroupMemberUUIDs,
  isDevelopment,
} from 'tailchat-shared';
import { ModalWrapper } from '../Modal';
import { WebFastForm } from '../WebFastForm';
import _compact from 'lodash/compact';
import { UserSelector } from '../UserSelector';
import { useFastFormContext } from 'tailchat-shared/components/FastForm/context';

interface Values {
  name: string;
  type: string | GroupPanelType;
  [key: string]: unknown;
}

const baseFields: FastFormFieldMeta[] = [
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

const schema = createFastFormSchema({
  name: fieldSchema
    .string()
    .required(t('面板名不能为空'))
    .max(20, t('面板名过长')),
  type: fieldSchema.string().required(t('面板类型不能为空')),
});

/**
 * 创建群组面板
 */
export const ModalCreateGroupPanel: React.FC<{
  groupId: string;
  onCreateSuccess: () => void;
}> = React.memo((props) => {
  const [currentValues, setValues] = useState<Partial<Values>>({});

  const [, handleSubmit] = useAsyncRequest(
    async (values: Values) => {
      const { name, type, ...meta } = values;
      let panelType: number;
      let provider: string | undefined = undefined;
      let pluginPanelName: string | undefined = undefined;

      if (typeof type === 'string') {
        // 创建一个来自插件的面板
        const panelName = type;
        panelType = GroupPanelType.PLUGIN;
        const pluginPanelInfo = findPluginPanelInfoByName(panelName);
        if (pluginPanelInfo) {
          provider = pluginPanelInfo.provider;
          pluginPanelName = pluginPanelInfo.name;
        }
      } else {
        panelType = type;
      }

      await createGroupPanel(props.groupId, {
        name,
        type: panelType,
        provider,
        pluginPanelName,
        meta,
      });
      showToasts(t('创建成功'), 'success');
      props.onCreateSuccess();
    },
    [props.groupId, props.onCreateSuccess]
  );

  const disableSendMessageWithoutRender = useMemo(() => {
    const DisableSendMessageWithoutComponent: React.FC = () => {
      const groupMemberUUIDs = useGroupMemberUUIDs(props.groupId);
      const context = useFastFormContext();

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
  }, [props.groupId]);

  const field = useMemo(() => {
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
      ]) as FastFormFieldMeta[];
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

  return (
    <ModalWrapper title={t('创建群组面板')} style={{ maxWidth: 440 }}>
      <WebFastForm
        schema={schema}
        fields={field}
        onChange={setValues}
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
});
ModalCreateGroupPanel.displayName = 'ModalCreateGroupPanel';
