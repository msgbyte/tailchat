import { PluginGroupPanel, pluginGroupPanel } from '@/plugin/common';
import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import React, { useMemo, useState } from 'react';
import {
  FastFormFieldMeta,
  GroupPanelType,
  t,
  useAsyncRequest,
  createGroupPanel,
} from 'tailchat-shared';
import { ModalWrapper } from '../Modal';
import { WebFastForm } from '../WebFastForm';

interface Values {
  name: string;
  type: string;
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
      props.onCreateSuccess();
    },
    [props.groupId, props.onCreateSuccess]
  );

  const field = useMemo(() => {
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
    <ModalWrapper title={t('创建群组面板')} style={{ width: 440 }}>
      <WebFastForm
        fields={field}
        onChange={setValues}
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
});
ModalCreateGroupPanel.displayName = 'ModalCreateGroupPanel';
