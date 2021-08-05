import { closeModal, openModal } from '@/components/Modal';
import { GroupDetail } from '@/components/modals/GroupDetail';
import { GroupInvite } from '@/components/modals/GroupInvite';
import React from 'react';
import { useCallback } from 'react';

/**
 * 群组 Header 的操作 hooks
 */
export function useGroupHeaderAction(groupId: string) {
  const handleShowGroupDetail = useCallback(() => {
    const key = openModal(
      <GroupDetail
        groupId={groupId}
        onClose={() => {
          closeModal(key);
        }}
      />
    );
  }, [groupId]);

  const handleInviteUser = useCallback(() => {
    openModal(<GroupInvite groupId={groupId} />);
  }, [groupId]);

  return { handleShowGroupDetail, handleInviteUser };
}
