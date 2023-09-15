import { LoadingSpinner } from '@/components/LoadingSpinner';
import React, { useState } from 'react';
import {
  t,
  useAsyncRequest,
  modifyGroupPanel,
  showToasts,
  useGroupPanelInfo,
  useEvent,
  ALL_PERMISSION,
  AlphaContainer,
} from 'tailchat-shared';
import { ModalWrapper } from '../../Modal';
import { WebMetaForm } from 'tailchat-design';
import { buildDataFromValues, pickValuesFromGroupPanelInfo } from './helper';
import type { GroupPanelValues } from './types';
import { useGroupPanelFields } from './useGroupPanelFields';
import { AdvanceGroupPanelPermission } from './AdvanceGroupPanelPermission';
import { CollapseView } from '@/components/CollapseView';
import _omit from 'lodash/omit';

/**
 * 修改群组面板
 */
export const ModalModifyGroupPanel: React.FC<{
  groupId: string;
  groupPanelId: string;
  onSuccess?: () => void;
}> = React.memo((props) => {
  const groupPanelInfo = useGroupPanelInfo(props.groupId, props.groupPanelId);
  const [currentValues, setValues] = useState<GroupPanelValues>(
    pickValuesFromGroupPanelInfo(groupPanelInfo)
  );

  const [, handleSubmit] = useAsyncRequest(async () => {
    await modifyGroupPanel(
      props.groupId,
      props.groupPanelId,
      buildDataFromValues(currentValues)
    );
    showToasts(t('修改成功'), 'success');
    typeof props.onSuccess === 'function' && props.onSuccess();
  }, [props.groupId, props.groupPanelId, props.onSuccess, currentValues]);

  const { fields, schema } = useGroupPanelFields(props.groupId, currentValues);

  const handleUpdateValues = useEvent((values: Partial<GroupPanelValues>) => {
    setValues((state) => ({
      ...state,
      ...values,
    }));
  });

  if (!groupPanelInfo) {
    return <LoadingSpinner />;
  }

  return (
    <ModalWrapper title={t('编辑群组面板')} style={{ maxWidth: 600 }}>
      <WebMetaForm
        schema={schema}
        fields={fields.filter((f) => f.type !== 'type')} // 变更时不显示类型
        initialValues={pickValuesFromGroupPanelInfo(groupPanelInfo)}
        onChange={handleUpdateValues}
        onSubmit={handleSubmit}
        extraProps={{
          suffixElement: (
            <CollapseView title={t('高级权限控制')} className="mb-2">
              <AdvanceGroupPanelPermission
                height={320}
                groupId={props.groupId}
                panelId={props.groupPanelId}
                onChange={(permissionMap) => {
                  if (permissionMap) {
                    const fallbackPermissions = permissionMap[ALL_PERMISSION];
                    const others = { ...permissionMap };

                    handleUpdateValues({
                      fallbackPermissions,
                      permissionMap: _omit(others, [ALL_PERMISSION]),
                    });
                  } else {
                    handleUpdateValues({
                      fallbackPermissions: undefined,
                      permissionMap: undefined,
                    });
                  }
                }}
              />
            </CollapseView>
          ),
        }}
      />
    </ModalWrapper>
  );
});
ModalModifyGroupPanel.displayName = 'ModalModifyGroupPanel';
