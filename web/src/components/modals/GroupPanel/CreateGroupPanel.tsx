import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import React, { useState } from 'react';
import {
  GroupPanelType,
  t,
  useAsyncRequest,
  createGroupPanel,
  createFastFormSchema,
  fieldSchema,
  showToasts,
} from 'tailchat-shared';
import { ModalWrapper } from '../../Modal';
import { WebFastForm } from '../../WebFastForm';
import { buildDataFromValues } from './helper';
import type { GroupPanelValues } from './types';
import { useGroupPanelFields } from './useGroupPanelFields';

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
  const [currentValues, setValues] = useState<Partial<GroupPanelValues>>({});

  const [, handleSubmit] = useAsyncRequest(
    async (values: GroupPanelValues) => {
      await createGroupPanel(props.groupId, buildDataFromValues(values));
      showToasts(t('创建成功'), 'success');
      props.onCreateSuccess();
    },
    [props.groupId, props.onCreateSuccess]
  );

  const fields = useGroupPanelFields(props.groupId, currentValues);

  return (
    <ModalWrapper title={t('创建群组面板')} style={{ maxWidth: 440 }}>
      <WebFastForm
        schema={schema}
        fields={fields}
        onChange={setValues}
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
});
ModalCreateGroupPanel.displayName = 'ModalCreateGroupPanel';
