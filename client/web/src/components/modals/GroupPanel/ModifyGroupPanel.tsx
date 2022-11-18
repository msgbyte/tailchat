import { LoadingSpinner } from '@/components/LoadingSpinner';
import React, { useState } from 'react';
import {
  t,
  useAsyncRequest,
  modifyGroupPanel,
  showToasts,
  useGroupPanelInfo,
} from 'tailchat-shared';
import { ModalWrapper } from '../../Modal';
import {
  createMetaFormSchema,
  metaFormFieldSchema,
  WebMetaForm,
} from 'tailchat-design';
import { buildDataFromValues, pickValuesFromGroupPanelInfo } from './helper';
import type { GroupPanelValues } from './types';
import { useGroupPanelFields } from './useGroupPanelFields';
import _omit from 'lodash/omit';

const schema = createMetaFormSchema({
  name: metaFormFieldSchema
    .string()
    .required(t('面板名不能为空'))
    .max(20, t('面板名过长')),
  type: metaFormFieldSchema.string().required(t('面板类型不能为空')),
});

/**
 * 修改群组面板
 */
export const ModalModifyGroupPanel: React.FC<{
  groupId: string;
  groupPanelId: string;
  onSuccess?: () => void;
}> = React.memo((props) => {
  const groupPanelInfo = useGroupPanelInfo(props.groupId, props.groupPanelId);
  const [currentValues, setValues] = useState<Partial<GroupPanelValues>>({});

  const [, handleSubmit] = useAsyncRequest(
    async (values: GroupPanelValues) => {
      await modifyGroupPanel(
        props.groupId,
        props.groupPanelId,
        buildDataFromValues(values)
      );
      showToasts(t('修改成功'), 'success');
      typeof props.onSuccess === 'function' && props.onSuccess();
    },
    [props.groupId, props.groupPanelId, props.onSuccess]
  );

  const fields = useGroupPanelFields(props.groupId, currentValues);

  if (!groupPanelInfo) {
    return <LoadingSpinner />;
  }

  return (
    <ModalWrapper title={t('编辑群组面板')} style={{ maxWidth: 440 }}>
      <WebMetaForm
        schema={schema}
        fields={fields.filter((f) => f.type !== 'type')} // 变更时不显示类型
        initialValues={pickValuesFromGroupPanelInfo(groupPanelInfo)}
        onChange={setValues}
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
});
ModalModifyGroupPanel.displayName = 'ModalModifyGroupPanel';
