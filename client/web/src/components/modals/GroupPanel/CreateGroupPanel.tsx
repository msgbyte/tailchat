import React, { useState } from 'react';
import {
  t,
  useAsyncRequest,
  createGroupPanel,
  showToasts,
} from 'tailchat-shared';
import { WebMetaForm } from 'tailchat-design';
import { ModalWrapper } from '../../Modal';
import { buildDataFromValues } from './helper';
import type { GroupPanelValues } from './types';
import { useGroupPanelFields } from './useGroupPanelFields';

/**
 * 创建群组面板
 */
export const ModalCreateGroupPanel: React.FC<{
  groupId: string;
  onSuccess?: () => void;
}> = React.memo((props) => {
  const [currentValues, setValues] = useState<Partial<GroupPanelValues>>({});

  const [, handleSubmit] = useAsyncRequest(
    async (values: GroupPanelValues) => {
      await createGroupPanel(props.groupId, buildDataFromValues(values));
      showToasts(t('创建成功'), 'success');
      typeof props.onSuccess === 'function' && props.onSuccess();
    },
    [props.groupId, props.onSuccess]
  );

  const { fields, schema } = useGroupPanelFields(props.groupId, currentValues);

  return (
    <ModalWrapper title={t('创建群组面板')} style={{ maxWidth: 440 }}>
      <WebMetaForm
        schema={schema}
        fields={fields}
        onChange={setValues}
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
});
ModalCreateGroupPanel.displayName = 'ModalCreateGroupPanel';
