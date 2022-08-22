import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import React from 'react';
import { model, t } from 'tailchat-shared';

interface RoleSummaryProps {
  currentRoleInfo: model.group.GroupRole;
  onChangeRoleName: (roleName: string) => void;
}
export const RoleSummary: React.FC<RoleSummaryProps> = React.memo((props) => {
  // 权限概述
  return (
    <div className="px-2">
      <FullModalField
        title={t('身份组名称')}
        value={props.currentRoleInfo.name}
        editable={true}
        renderEditor={DefaultFullModalInputEditorRender}
        onSave={props.onChangeRoleName}
      />
    </div>
  );
});
RoleSummary.displayName = 'RoleSummary';
