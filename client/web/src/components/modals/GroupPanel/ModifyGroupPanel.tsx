import { LoadingSpinner } from '@/components/LoadingSpinner';
import React, { useMemo, useState } from 'react';
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
import type { GroupPanel } from 'tailchat-shared';
import { ModalWrapper } from '../../Modal';
import { WebMetaForm } from 'tailchat-design';
import { buildDataFromValues, pickValuesFromGroupPanelInfo } from './helper';
import type { GroupPanelValues } from './types';
import { useGroupPanelFields } from './useGroupPanelFields';
import { AdvanceGroupPanelPermission } from './AdvanceGroupPanelPermission';
import { CollapseView } from '@/components/CollapseView';
import _omit from 'lodash/omit';

const ModifyGroupPanelForm: React.FC<{
  groupId: string;
  groupPanelId: string;
  groupPanelInfo: GroupPanel;
  onSuccess?: () => void;
}> = React.memo((props) => {
  const { groupId, groupPanelId, groupPanelInfo, onSuccess } = props;
  const [currentValues, setValues] = useState<GroupPanelValues>(() =>
    pickValuesFromGroupPanelInfo(groupPanelInfo)
  );

  const [, handleSubmit] = useAsyncRequest(async () => {
    await modifyGroupPanel(
      groupId,
      groupPanelId,
      buildDataFromValues(currentValues)
    );
    showToasts(t('修改成功'), 'success');
    typeof onSuccess === 'function' && onSuccess();
  }, [groupId, groupPanelId, onSuccess, currentValues]);

  const { fields, schema } = useGroupPanelFields(groupId, currentValues);

  const handleUpdateValues = useEvent((values: Partial<GroupPanelValues>) => {
    setValues((state) => ({
      ...state,
      ...values,
    }));
  });

  const initialFormValues = useMemo(
    () =>
      _omit(pickValuesFromGroupPanelInfo(groupPanelInfo), [
        'permissionMap',
        'fallbackPermissions',
      ]),
    [groupPanelInfo]
  );

  const handleFormValuesChange = useEvent(
    (values: Partial<GroupPanelValues>) => {
      handleUpdateValues(
        _omit(values, ['permissionMap', 'fallbackPermissions'])
      );
    }
  );

  return (
    <ModalWrapper title={t('编辑群组面板')} style={{ width: 600 }}>
      <WebMetaForm
        schema={schema}
        fields={fields.filter((f) => f.type !== 'type')} // 变更时不显示类型
        initialValues={initialFormValues}
        onChange={handleFormValuesChange}
        onSubmit={handleSubmit}
        extraProps={{
          suffixElement: (
            <CollapseView title={t('高级权限控制')} className="mb-2">
              <AdvanceGroupPanelPermission
                height={320}
                groupId={groupId}
                panelId={groupPanelId}
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
ModifyGroupPanelForm.displayName = 'ModifyGroupPanelForm';

/**
 * 修改群组面板
 */
export const ModalModifyGroupPanel: React.FC<{
  groupId: string;
  groupPanelId: string;
  onSuccess?: () => void;
}> = React.memo((props) => {
  const groupPanelInfo = useGroupPanelInfo(props.groupId, props.groupPanelId);

  if (!groupPanelInfo) {
    return <LoadingSpinner />;
  }

  return (
    <ModifyGroupPanelForm
      groupId={props.groupId}
      groupPanelId={props.groupPanelId}
      groupPanelInfo={groupPanelInfo}
      onSuccess={props.onSuccess}
    />
  );
});
ModalModifyGroupPanel.displayName = 'ModalModifyGroupPanel';
