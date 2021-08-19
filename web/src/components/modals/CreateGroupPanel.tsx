import React from 'react';
import {
  FastFormFieldMeta,
  GroupPanelType,
  t,
  useAsyncRequest,
} from 'tailchat-shared';
import { createGroupPanel } from '../../../../shared/model/group';
import { ModalWrapper } from '../Modal';
import { WebFastForm } from '../WebFastForm';

type Values = {
  name: string;
  type: string;
};

const baseFields: FastFormFieldMeta[] = [
  { type: 'text', name: 'name', label: t('面板名') },
  {
    type: 'select',
    name: 'type',
    label: t('类型'),
    options: [
      {
        label: t('聊天频道'),
        value: GroupPanelType.TEXT,
      },
      {
        label: t('面板分组'),
        value: GroupPanelType.GROUP,
      },
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
  const [, handleSubmit] = useAsyncRequest(
    async (values: Values) => {
      const { name, type } = values;
      let panelType: number;

      if (typeof type === 'string') {
        panelType = GroupPanelType.PLUGIN;
      } else {
        panelType = type;
      }

      await createGroupPanel(props.groupId, {
        name,
        type: panelType,
      });
      props.onCreateSuccess();
    },
    [props.groupId, props.onCreateSuccess]
  );

  return (
    <ModalWrapper title={t('创建群组面板')} style={{ width: 440 }}>
      <WebFastForm fields={baseFields} onSubmit={handleSubmit} />
    </ModalWrapper>
  );
});
ModalCreateGroupPanel.displayName = 'ModalCreateGroupPanel';
